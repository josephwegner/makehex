class MapChannel < ApplicationCable::Channel
  def subscribed
    stream_from "map_#{params[:map]}"
  end

  def receive(data)
    ActionCable.server.broadcast("map_#{params[:map]}", data)
  end
end
