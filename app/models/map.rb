class Map < ApplicationRecord
  belongs_to :default_layout, class_name: 'Layout', foreign_key: 'default_layout_id', optional: true
  belongs_to :user
  has_many :layouts
  has_many :players

  def cookie_auth_token
    "map_#{self.access_code}_authorization"
  end
end
