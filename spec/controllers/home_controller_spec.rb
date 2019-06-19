require 'rails_helper'

RSpec.describe HomeController do
  describe 'GET index' do
    context 'when user is logged in' do
      login_user

      it 'sets the CTA path to the maps index' do
        get :index
        expect(assigns(:cta_path)).to eq(maps_path)
      end
    end # when the user is logged in

    context 'when the user is logged out' do
      it 'sets the CTA path to the sign in page' do
        get :index
        expect(assigns(:cta_path)).to eq(new_user_registration_path)
      end
    end
  end # GET index
end
