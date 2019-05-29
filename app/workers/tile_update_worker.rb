require 'json'

class TileUpdateWorker
  include Sidekiq::Worker
  sidekiq_options lock: :until_executing

  sidekiq_retries_exhausted do |msg, _ex|
    SidekiqUniqueJobs::Digests.del(digest: msg['unique_digest']) if msg['unique_digest']
  end

  def perform(layout_id)
    Redis.current.with do |conn|
      tiles = conn.hgetall(layout_id)

      layout = Layout.find_by_id(layout_id)

      tiles.each do |coords_s, features|
        coords = coords_s.split('_').map { |c| c.to_i }
        if !layout.grid.has_key?(coords[0])
          layout.grid[coords[0]] = {}
        end

        layout.grid[coords[0]][coords[1]] = JSON.parse(features)
      end

      layout.save!
      conn.del(layout_id)

      if tiles.size > 0
        ActionCable.server.broadcast("map_#{layout.map.id}", {
          layout: layout.id,
          grid: layout.grid
        })
        puts "Updated #{tiles.size} tiles"
      end
    end
  end
end
