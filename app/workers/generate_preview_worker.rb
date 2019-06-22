class GeneratePreviewWorker
  include Sidekiq::Worker

  def perform(map_id)
    map = Map.find(map_id)

    if map
      svg = Preview.svg_from_layout(map.default_layout)
      io = Preview::FileStringIO.new(svg, map.preview_filename)
      map.preview = io
      map.save!
    else
      puts "workers/generate_preview could not find map #{map_id}"
    end
  end
end
