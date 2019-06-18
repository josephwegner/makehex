class LayoutsController < ApplicationController
  before_action :authenticate_user!

  def create
    @map = Map.find(params[:map])
    @layout = Layout.new(secure_params)
    @layout.update_attributes(grid: [], map: @map)
    @layout.save
    render :json => @layout
  end

  def update
    @layout = Layout.find_by_id(params[:id])
    if @layout.update_attributes(secure_params)
      render :json => { success: true }
    else
      render :json => { success: false }
    end
  end

  private

  def secure_params
    params.require(:layout).permit(:name)
  end
end
