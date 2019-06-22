class AddPreviewToMaps < ActiveRecord::Migration[5.1]
  def change
    add_column :maps, :preview, :string
  end
end
