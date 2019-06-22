namespace :previews do
  desc "Generate a test preview, don't persist it"
  task test: :environment do
    puts svg_from_layout(Layout.first)
  end

  desc "Generate a preview for a single layout"
  task :for_map, [:map_id] => [:environment] do |task, args|
    map = Map.find(args[:map_id])
    layout = map.default_layout

    if layout
      svg = Preview.svg_from_layout(layout)

      io = Preview::FileStringIO.new(svg, map.preview_filename)

      map.preview = io
      map.save
    else
      put "Layout not found"
    end
  end

  desc "Generate a preview for every map that does not have one"
  task all: :environment do
    maps = Map.where(preview: nil)
    puts "Generating #{maps.length} previews..."
    maps.each_with_index do |map, i|
      Rake::Task['previews:for_map'].execute({ map_id: map.id})
      puts "Generated map for map ##{map.id}. #{maps.length - i} maps remaining."
    end
  end

  desc "Regenerate previews for maps that had one but are now missing. This only works locally."
  task refill: :environment do
    include Rails.application.routes.url_helpers

    maps = Map.where.not(preview: nil)
    maps.each do |map|
      relative = ActionController::Base.helpers.asset_path(map.preview.url)
      path = "#{Rails.root.join("public")}#{relative}"

      if !File.exist?(path)
        Rake::Task['previews:for_map'].execute({ map_id: map.id})
        puts "Generated map for map ##{map.id}."
      end
    end
  end
end

def svg_from_layout(layout)
  json = layout.to_json

  # make sure to fork in the worker
  pack_path =  ActionController::Base.helpers.asset_pack_path('ssr.js')
  %x<node lib/draw_layout.js '#{pack_path}' '#{json}'>
end
