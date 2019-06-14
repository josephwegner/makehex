class ApplicationMailer < ActionMailer::Base
  default from: "MakeHex <#{ENV['EMAIL_FROM']}>"
  layout 'mailer'
end
