class HomeController < ApplicationController
  def index
    @map = Map.first
  end
end
