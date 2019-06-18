class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def after_sign_in_path_for(resource)
    maps_path
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end
end
