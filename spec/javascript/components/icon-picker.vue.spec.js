import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon'
import IconPicker from '../../../app/javascript/components/icon-picker.vue'

describe('IconPicker', () => {
  describe('render', () => {
    it('shows the currently picked icon', () => {
      var previewIconStub = sinon.stub(IconPicker.computed, 'previewIcon')
      previewIconStub.callsFake(() => {
        return 'testicon'
      })

      var picker = shallowMount(IconPicker)
      var icon = picker.find('.selected-icon use').attributes('href')
      expect(icon).to.contain('#testicon')
    })
  })
})
