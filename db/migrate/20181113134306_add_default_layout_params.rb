class AddDefaultLayoutParams < ActiveRecord::Migration[5.1]
  def change
    change_column :layouts, :height, :integer, :default => 15
    change_column :layouts, :width, :integer, :default => 25
    change_column :layouts, :grid, :jsonb, :default => []
  end
end
