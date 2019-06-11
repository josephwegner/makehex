class PlayersController < ApplicationController
  def load
    if !params[:player_code]
      redirect_to "/maps/#{map.access_code}"
    else
      @map = Map.where(access_code: params[:map_code]).first

      if !@map
        # This is not the right thing to do, really...
        redirect_to "/maps/#{params[:map_code]}"
        return
      end

      @player = Player.where(map: @map, code: params[:player_code]).first

      if !@player
        redirect_to "/maps/#{params[:map_code]}", flash: { load_errors: ["Access code not found"] }
        return
      end

      session[@map.cookie_auth_token] = true
      @editor = false
      render :template => "maps/show_map"
    end
  end

  def create
    map = Map.find_by_id(params[:player][:map])

    @player = Player.create(secure_params)
    @player.map = map
    @player.save

    if @player.errors
      redirect_to "/maps/#{map.access_code}", flash: { create_errors: @player.errors.full_messages }
    else
      redirect_to "/maps/#{map.access_code}/#{@player.code}"
    end
  end

  private

  def secure_params
    params.require(:player).permit(
      :code,
      :token_color,
      :token_label
    )
  end

end
