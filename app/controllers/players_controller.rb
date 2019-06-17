class PlayersController < ApplicationController
  layout false
  layout 'application', :except => :token
  layout "map", :only => [:load]

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
      session[:player_token] ||= "#{@player.code}_#{@map.access_code}"

      @player_id = @player.id
      render :template => "maps/show_map"
    end
  end

  def create
    map = Map.find_by_id(params[:player][:map])

    @player = Player.create(secure_params)
    @player.map = map
    @player.save

    if !@player.valid?
      redirect_to "/maps/#{map.access_code}", flash: { create_errors: @player.errors.full_messages }
    else
      UserMailer.with({
        user: map.user,
        player: @player,
        map: map
      }).new_player_email.deliver_later
      redirect_to "/maps/#{map.access_code}/#{@player.code}"
    end
  end

  def token
    @player = Player.find_by_id(params['player_id'])

    if !@player
      not_found
    end

    respond_to do |format|
      format.svg { render :template => "players/token" }
      format.png {
        rendered = render_to_string(:template => "players/token.svg")
        img, data = Magick::Image.from_blob(rendered) {
          self.format = 'SVG'
          self.background_color = 'transparent'
          self.size = "86.6x100"
        }

        blob = img.to_blob {
          self.format = 'PNG'
        }
        send_data blob, :type => "image/png", :disposition => "inline"
      }
    end
  end

  private

  def secure_params
    sec = params.require(:player).permit(
      :code,
      :token_color,
      :token_label
    )

    if sec.has_key?(:token_color) && sec[:token_color][0] = '#'
      sec[:token_color] = sec[:token_color].slice(1, 6)
    end

    return sec
  end

end
