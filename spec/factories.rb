FactoryBot.define do
  factory :user do
    sequence :email do |n|
      "person#{n}@example.com"
    end
    password { "blahblah" }
  end

  factory :map do
    sequence :access_code do |n|
      "aa#{n}bb"
    end
    user
  end

  factory :player do
    sequence :code do |n|
      "aa#{n}bb"
    end
    sequence :token_label do |n|
      "#{n}#{n}"
    end
    token_color { "CCCCCC" }
    map
  end
end
