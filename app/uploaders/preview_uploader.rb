class PreviewUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave unless Rails.env.development?
  
  def store_dir
    "uploads/previews"
  end
end
