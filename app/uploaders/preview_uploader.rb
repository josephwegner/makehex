class PreviewUploader < CarrierWave::Uploader::Base
  storage :file

  def store_dir
    "uploads/previews"
  end
end
