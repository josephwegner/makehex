require 'rails_helper'

RSpec.describe MapsController do
  describe 'POST create' do
    login_user
    it 'triggers a preview image when a map is created' do
      response = post :create, params: {
        map: {
          name: 'test'
        }
      }

      id = response.headers['Location'].partition('/maps/')[2].to_i

      expect(GeneratePreviewWorker).to have_enqueued_sidekiq_job(id)
    end
  end

  describe 'PUT update' do
    login_user

    it 'triggers a preview image update when the layout changes' do
      map = create(:map_with_layouts)
      put :update, params: {
        id: map.id,
        map: {
          default_layout_id: (map.default_layout.id + 1)
        }
      }

      expect(GeneratePreviewWorker).to have_enqueued_sidekiq_job(map.id)
    end

    it 'does not trigger a preview image update when the name changes' do
      map = create(:map_with_layouts)
      put :update, params: {
        id: map.id,
        map: {
          name: 'New Name'
        }
      }

      expect(GeneratePreviewWorker).to_not have_enqueued_sidekiq_job(map.id)
    end
  end
end
