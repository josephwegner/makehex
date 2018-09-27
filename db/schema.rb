# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180927190452) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "layouts", force: :cascade do |t|
    t.string "name"
    t.bigint "map_id"
    t.jsonb "grid"
    t.integer "height"
    t.integer "width"
    t.index ["map_id"], name: "index_layouts_on_map_id"
  end

  create_table "maps", force: :cascade do |t|
    t.string "name"
    t.bigint "default_layout_id"
    t.index ["default_layout_id"], name: "index_maps_on_default_layout_id"
  end

end
