class MapsController < ApplicationController
  before_action :authenticate_user!, :except => [:show]

  def index
  end

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
    attributes = secure_params
    attributes[:access_code] = generate_token
    @map = Map.new(attributes)

    @layout = Layout.create(
      name: 'Untitled',
      map: @map,
      height: 15,
      width: 15,
      grid: {}
    )

    @map.update(default_layout: @layout, user: current_user)
    @layout.save
    @map.save
    flash[:notice] = "Created #{@map.name}"
    redirect_to map_path(@map)

    GeneratePreviewWorker.perform_async(@map.id)
  end

  def update
    @map = Map.find_by_id(params[:id])
    attrs = secure_params

    if @map.update_attributes(attrs)
      render :json => { success: true }

      if attrs.include?(:default_layout_id)
        GeneratePreviewWorker.perform_async(@map.id)
      end
    else
      render :json => { success: false }
    end
  end

  private

  def show_map(params)
    authenticate_user!
    @map = Map.find_by_id(params[:id])

    if map_admin?(@map)
      @player_id = 'dm'
      respond_to do |format|
        format.json { render :json => @map, :include => ['layouts', 'players'] }
        format.html { render :template => "maps/show_map", :layout => "map" }
      end
    elsif session[@map.cookie_auth_token]
      respond_to do |format|
        format.json { render :json => @map, :include => ['layouts', 'players'] }
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

  def map_admin?(map)
    @map.user == current_user || ENV['ADMIN_EMAILS'].split(' ').include?(current_user.email)
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
