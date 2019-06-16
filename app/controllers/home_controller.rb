class HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    @map_colors = {}
    current_user.maps.each do |map|
      colors = {}
      map.layouts.each do |layout|
        layout.grid.each_value do |q|
          q.each_value do |tile|
            if tile.has_key?('color')
              colors[tile['color']] ||= 0
              colors[tile['color']] += 1
            end
          end #q.each
        end #grid.each
      end #layouts.each

      @map_colors[map.id] = colors.max_by(5) { |k,v| v }.map { |obj|
        # Wee bit of XSS protection
        obj[0].gsub(/[^A-Za-z0-9#]/, '')[0...7]
      }
    end #maps.each
  end
end
