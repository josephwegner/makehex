require 'rails_helper'

describe "maps/show_map.html.erb" do
  before(:each) do
    assign(:map, FactoryBot.create(:map))
    assign(:player, FactoryBot.create(:player))
  end

  it 'renders a hex def' do
    render

    expect(rendered).to match('polygon id="hex"')
  end
end
