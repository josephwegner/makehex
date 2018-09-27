Rails.application.routes.draw do

  root 'home#index'
  get 'caf' => 'caf#index'
  get 'weather/:latitude/:longitude' => 'weather#get', :constraints => {
    :latitude => /.*/,
    :longiude => /.*/
  }

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
