require 'connection_pool'

Redis.current = ConnectionPool.new(size: 10, timeout: 5) do
  Redis.new url: 'poop'
end
