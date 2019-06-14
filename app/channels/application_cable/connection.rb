module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private
      def find_verified_user
        current_user = env['warden'].user
        if current_user
          current_user
        elsif request.session[:player_token]
          current_user = "player_#{request.session[:player_token]}"
        else
          reject_unauthorized_connection
        end
      end
  end
end
