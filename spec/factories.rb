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

    factory :map_with_layouts do
      transient do
        layouts_count { 5 }
      end

      after(:create) do |map, evaluator|
        create_list(:layout, evaluator.layouts_count, map: map)
        map.default_layout = map.layouts.first
      end
    end
  end

  factory :layout do
    name { "A Room" }
    map
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
