class AddMapsAndLayers < ActiveRecord::Migration[5.1]
  def change
    create_table :maps do |t|
      t.string :name
      t.references :default_layout
    end

    create_table :layouts do |t|
      t.string :name
      t.references :map
      t.jsonb :grid
    end
  end
end
