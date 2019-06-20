require 'connection_pool'


if ENV['RAILS_ENV'] == 'development'
  require 'dotenv/load'
end

Sidekiq.configure_client do |config|
  config.redis = ConnectionPool.new(size: ENV['SIDEKIQ_REDIS_POOL'] || 15, timeout: 5) do
    Redis.new url: ENV['REDIS_URL'], id: 'SidekiqClient'
  end
end


Sidekiq.configure_server do |config|
  config.redis = ConnectionPool.new(size: ENV['SIDEKIQ_REDIS_POOL'] || 15, timeout: 5) do
    Redis.new url: ENV['REDIS_URL'], id: 'SidekiqServer'
  end
end
