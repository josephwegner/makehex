require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Hexamagon
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

  Hexamagon::Application.config.session_store :redis_store,
    servers: [ENV['REDIS_URL']],
    expire_after: 90.minutes,
    key: "_#{Rails.application.class.parent_name.downcase}_session",
    threadsafe: false
  end
end
