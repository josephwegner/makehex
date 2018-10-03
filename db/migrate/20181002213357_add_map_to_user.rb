class AddMapToUser < ActiveRecord::Migration[5.1]
  def change
    add_reference :maps, :user, index: true
  end
end
