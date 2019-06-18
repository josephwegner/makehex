class AddTimestamps < ActiveRecord::Migration[5.1]
  def change
    add_timestamps :players, default: Time.zone.now
    change_column_default :players, :created_at, nil
    change_column_default :players, :updated_at, nil

    add_timestamps :maps, default: Time.zone.now
    change_column_default :maps, :created_at, nil
    change_column_default :maps, :updated_at, nil

    add_timestamps :layouts, default: Time.zone.now
    change_column_default :layouts, :created_at, nil
    change_column_default :layouts, :updated_at, nil
  end
end
