class MapsController < ApplicationController
  def show
    @map = Map.find_by_id(params[:id])
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
    @layout = Layout.create(name: 'Untitled', map: @map, height: 15, width: 25, grid: [])
    @map.update(default_layout: @layout, user: current_user)
    @layout.save
    @map.save
    flash[:notice] = "Created #{@map.name}"
    redirect_to root_path
  end

  private

  def secure_params
    params.require(:map).permit(:name)
  end
end
