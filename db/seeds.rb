# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#pintonville = Map.create(name: 'Pintonville')

h = 15
w = 20
grid = []
(1..w).each do |x|
  (1..h).each do |y|
    grid.push({
      color: 'blue'
    })
  end
end

[64, 65, 85, 69, 70, 90, 144, 165, 166, 167, 168, 169, 170, 150].each do |i|
  grid[i]['color'] = 'green'
end

#downtown = Layout.create(
#  name: 'Downtown',
#  map: pintonville,
#  grid: grid,
#  height: h,
#  width: w
#)

#pintonville.update!(default_layout: downtown)
