redis_conn = proc {
  Redis.new # do anything you want here
}

Sidekiq.configure_client do |config|
  config.redis = ConnectionPool.new(size: ENV['SIDEKIQ_REDIS_POOL'] || 5, &redis_conn)
end
