require 'connection_pool'

Sidekiq.configure_client do |config|
  puts 'Opening sidekiq client redis connection'
  config.redis = ConnectionPool.new(size: ENV['SIDEKIQ_REDIS_POOL'] || 5, timeout: 5) do
    Redis.new url: ENV['REDIS_URL']
  end
end


Sidekiq.configure_server do |config|
  puts 'Opening sidekiq server redis connection'
  config.redis = ConnectionPool.new(size: ENV['SIDEKIQ_REDIS_POOL'] || 5, timeout: 5) do
    Redis.new url: ENV['REDIS_URL']
  end
end
