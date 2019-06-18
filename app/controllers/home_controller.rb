class HomeController < ApplicationController
  layout 'marketing', :except => [:pricing]
  def index
  end

  def pricing
  end
end
