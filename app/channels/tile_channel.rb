require 'sidekiq'

class TileChannel < ApplicationCable::Channel
  def subscribed
    stream_from "layout_#{params[:layout]}_tiles"
  end

  def receive(data)
    return unless data['method']

    case data['method']
    when 'updateTiles'
      update_tiles(data['payload'], params)

    when 'pushLayout'
      update_layout(data['payload'], params)

    end
  end

  private

  def update_tiles(updates, params)
    if !updates.kind_of?(Array)
      updates = [updates]
    end

    layout = Layout.find(params[:layout])

    if layout.map.user.id == current_user
      Redis.current.with do |conn|
        updateGrid = {}
        updates.each do |tile|
          features = tile.reject { |k| ['q', 'r'].include?(k) }

          if !updateGrid.has_key?(tile['q'])
            updateGrid[tile['q']] = {}
          end
          updateGrid[tile['q']][tile['r']] = features

          ActionCable.server.broadcast("layout_#{params[:layout]}_tiles", updateGrid)
          conn.hset(params[:layout], "#{tile['q']}_#{tile['r']}", features.to_json)
        end
      end

      TileUpdateWorker.perform_in(ENV['GRID_UPDATE_INTERVAL'].to_i.seconds, params[:layout])
    else
      updateGrid = {}
      updates.each do |tile|
        if !updateGrid.has_key?(tile['q'])
          updateGrid[tile['q']] = {}
        end

        updateGrid[tile['q']][tile['r']] = layout.grid[tile['q'].to_s][tile['r'].to_s]
      end

      ActionCable.server.broadcast("layout_#{params[:layout]}_tiles", updateGrid)
    end
  end

  def update_layout(updates, params)
    layout = Layout.find(params[:layout])
    layout.update!(secure_params(updates))

    Redis.current.with do |conn|
      conn.del(params[:layout])
    end
  end

  def secure_params(params)
    keep_params = ['name', 'height', 'width', 'grid']
    params.keep_if { |key, value| value != nil && keep_params.include?(key) }
  end
end
