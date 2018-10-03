# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.new
user.email = 'test@test.com'
user.password = 'testtest'
user.password_confirmation = 'testtest'
user.save!

other_user = User.new
other_user.email = 'test2@test.com'
other_user.password = 'testtest'
other_user.password_confirmation = 'testtest'
other_user.save!

map = Map.new(name: 'Pintonville', user: user)
layout = Layout.new(name: 'Downtown', map: map, height: 15, width: 25, grid: [])
map.update(default_layout: layout)
map.save
layout.save
