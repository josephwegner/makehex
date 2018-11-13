class MapsController < ApplicationController
  def show
    @map = Map.find_by_id(params[:id])
    @editor = @map.user == current_user

    respond_to do |format|
      format.json { render :json => @map, :include => 'layouts' }
      format.html
    end
  end

  def new
    @map = Map.new
  end

  def create
    @map = Map.new(secure_params)
    @layout = Layout.create(name: 'Untitled', map: @map)
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

  def secure_params
    params.require(:map).permit(:name, :default_layout_id)
  end
end
