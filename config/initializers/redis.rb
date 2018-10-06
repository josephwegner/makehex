require 'connection_pool'

Redis.current = ConnectionPool.new(size: ENV['RAILS_REDIS_POOL'] || 5, timeout: 5) do
  Redis.new url: ENV['REDIS_URL'], id: 'TileUpdateCacher'
end
