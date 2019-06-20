import { mount, shallowMount } from '@vue/test-utils'

const comp_path = '../../../app/javascript/components/icon-picker.vue'
import IconPicker from '../../../app/javascript/components/icon-picker.vue'

describe('IconPicker', () => {
  describe('render', () => {
    test('shows the currently picked icon', () => {
      var picker = mount(IconPicker, {
        computed: {
          previewIcon() { return 'testicon' }
        }
      })
      var icon = picker.find('.selected-icon use').attributes('href')
      expect(icon).toContain('#testicon')
    })
  })
})
