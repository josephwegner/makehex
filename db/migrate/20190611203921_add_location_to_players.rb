class AddLocationToPlayers < ActiveRecord::Migration[5.1]
  def change
    add_column :players, :layout, :integer
    add_column :players, :location_q, :integer
    add_column :players, :location_r, :integer
  end
end
