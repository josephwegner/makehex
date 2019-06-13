class UserMailer < ApplicationMailer
  layout 'transactional_email'

  def new_player_email
    @user = params[:user]
    @map = params[:map]
    @player = params[:player]
    puts @user.email

    mail(to: @user.email, subject: "A player was added to #{@map.name}")
  end
end
