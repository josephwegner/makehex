Premailer::Rails.config.merge!({
  preserve_styles: true,
  remove_ids: true,
  base_url: Rails.configuration.action_mailer.asset_host
})
