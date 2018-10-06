require 'sidekiq'

class TileChannel < ApplicationCable::Channel
  def subscribed
    stream_from "layout_#{params[:layout]}_tiles"
  end

  def receive(data)
    if data['updates'].kind_of?(Array)
      updates = data['updates']
    else
      updates = [data['updates']]
    end

    ActionCable.server.broadcast("layout_#{params[:layout]}_tiles", updates)
    Redis.current.with do |conn|
      updates.each do |tile|
        conn.hset(params[:layout], tile['index'], tile.reject { |k| k == 'index' }.to_json)\
      end
    end

    TileUpdateWorker.perform_in(ENV['GRID_UPDATE_INTERVAL'].to_i.seconds, params[:layout])
  end
end
