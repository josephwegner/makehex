class HomeController < ApplicationController
  layout 'marketing', :except => [:pricing]
  def index
    if user_signed_in?
      @cta_path = maps_path
    else
      @cta_path = new_registration_path(User)
    end
  end

  def pricing
  end
end
