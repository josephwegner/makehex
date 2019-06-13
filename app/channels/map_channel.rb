require 'sidekiq'

class MapChannel < ApplicationCable::Channel
  def subscribed
    stream_from "map_#{params[:map]}"
  end

  def receive(data)

      return unless data['method']

      case data['method']
      when 'movePlayer'
        move_player(data['payload'], params)

      end
  end

  private

  def move_player(player_data, params)
    player = Player.find_by_id(player_data['id'])

    if player.map.id == params[:map]
      player.update(location_q: player_data['q'], location_r: player_data['r'], layout: player_data['layout'])
      ActionCable.server.broadcast("map_#{params[:map]}", {
        method: 'updatePlayer',
        payload: player_data
      })
    end
  end
end
