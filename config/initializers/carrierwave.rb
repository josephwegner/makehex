CarrierWave.configure do |config|
  if Rails.env.development?
    config.storage = :file
  end
end
