class MapController < ApplicationController
  def get
    render :json => Map.find_by_id(params[:id]), :include => 'layouts'
  end
end
