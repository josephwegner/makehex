# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def new_player_email
    UserMailer.with({
      user: User.first,
      player: Player.first,
      map: Map.first
    }).new_player_email
  end
end
