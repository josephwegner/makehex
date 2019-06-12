class UserMailer < ApplicationMailer
  def new_player_email
    @user = params[:user]
    @map = params[:map]
    @player = params[:player]

    mail(to: 'joe@joewegner.com', subject: "A player was added to #{@map.name}")
  end
end
