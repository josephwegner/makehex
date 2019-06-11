class Player < ApplicationRecord
  belongs_to :map

  validates_exclusion_of :code, :in => %w(load),
      :message => 'Player code "%{value}" is reserved.'
  validates_uniqueness_of :code, :scope => :map,
    :message => 'Player code "%{value}" is already in use for this map'
  validates_uniqueness_of :token_label, :scope => :map,
    :message => 'Token label "%{value}" is already in use for this map'
  validates :token_label, length: { maximum: 2 }
  validates :token_color, length: { is: 6 }
  validates :code, :token_label, :token_color, presence: true
end
