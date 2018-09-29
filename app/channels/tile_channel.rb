require 'sidekiq'

class TileChannel < ApplicationCable::Channel
  def subscribed
    stream_from "layout_#{params[:layout]}_tiles"
  end

  def receive(data)
    ActionCable.server.broadcast("layout_#{params[:layout]}_tiles", data)
    Redis.current.with do |conn|
      conn.hset(params[:layout], data['index'], data['color'])
    end
    TileUpdateWorker.perform_in(ENV['GRID_UPDATE_INTERVAL'].to_i.seconds, params[:layout])
  end
end
