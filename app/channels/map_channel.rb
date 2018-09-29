require 'sidekiq'

class MapChannel < ApplicationCable::Channel
  def subscribed
    stream_from "map_#{params[:map]}"
  end

  def receive(data)
    # noop
    puts 'received data for map channel, nothing to do with it.'
  end
end
