class HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    puts current_user
  end
end
