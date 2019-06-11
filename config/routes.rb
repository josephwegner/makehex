Rails.application.routes.draw do

  devise_for :users
  root 'home#index'
  resources :maps
  resources :layouts
  resources :players
  get 'maps/:map_code/load', to: "players#load"
  get 'maps/:map_code/:player_code', to: "players#load"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
