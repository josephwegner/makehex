class AddLayoutDimensions < ActiveRecord::Migration[5.1]
  def change
    add_column :layouts, :height, :integer
    add_column :layouts, :width, :integer
  end
end
