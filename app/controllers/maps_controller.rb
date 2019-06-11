class MapsController < ApplicationController
  def show
    # If the id is numeric, this is a direct map load. Otherwise it is an access code
    if params[:id].match(/\A[0-9]+\Z/)
      show_map(params)
    else
      show_auth_player(params)
    end
  end

  def new
    @map = Map.new
  end

  def create
    @map = Map.new(secure_params)
    @layout = Layout.create(
      name: 'Untitled',
      map: @map,
      height: 15,
      width: 15,
      grid: [],
      access_code: generate_token
    )

    @map.update(default_layout: @layout, user: current_user)
    @layout.save
    @map.save
    flash[:notice] = "Created #{@map.name}"
    redirect_to root_path
  end

  def update
    @map = Map.find_by_id(params[:id])
    if @map.update_attributes(secure_params)
      render :json => { success: true }
    else
      render :json => { success: false }
    end
  end

  private

  def show_map(params)
    @map = Map.find_by_id(params[:id])

    if @map.user == current_user
      @editor = true
      respond_to do |format|
        format.json { render :json => @map, :include => 'layouts' }
        format.html { render :template => "maps/show_map" }
      end
    elsif session[@map.cookie_auth_token]
      @editor = false
      respond_to do |format|
        format.json { render :json => @map, :include => 'layouts' }
        format.html { not_found }
      end
    else
      not_found
    end
  end

  def show_auth_player(params)
    @map = Map.where(access_code: params[:id]).first
    @new_player = Player.new
    respond_to do |format|
      format.json { render :json => @map, :include => 'layouts' }
      format.html { render :template => "maps/auth_player" }
    end
  end

  def secure_params
    params.require(:map).permit(:name, :default_layout_id)
  end

  def generate_token
    loop do
      random_token = SecureRandom.alphanumeric(5).downcase
      break random_token unless Map.exists?(access_code: random_token)
    end
  end
end
