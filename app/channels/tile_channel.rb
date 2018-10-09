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

    ActionCable.server.broadcast("layout_#{params[:layout]}_tiles", updates)
    Redis.current.with do |conn|
      updates.each do |tile|
        conn.hset(params[:layout], tile['index'], tile.reject { |k| k == 'index' }.to_json)\
      end
    end

    TileUpdateWorker.perform_in(ENV['GRID_UPDATE_INTERVAL'].to_i.seconds, params[:layout])
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
