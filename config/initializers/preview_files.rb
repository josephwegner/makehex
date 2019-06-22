module Preview
  class FileStringIO < StringIO
    def initialize(contents, filename)
      super(contents)
      @filename = filename
    end

    def original_filename
      @filename
    end
  end

  def self.svg_from_layout(layout)
    puts "Generating preview for layout #{layout.id}"
    json = layout.to_json

    # make sure to fork in the worker
    pack_path =  ActionController::Base.helpers.asset_pack_path('ssr.js')
    %x<node lib/draw_layout.js '#{pack_path}' '#{json}'>
  end
end
