import { shallowMount, mount } from '@vue/test-utils'

const comp_path = '../../../app/javascript/components/icon-picker.vue'
import IconPicker from '../../../app/javascript/components/icon-picker.vue'

describe('IconPicker', () => {
  describe('render', () => {
    test('shows the denied icon by default', () => {
      var picker = shallowMount(IconPicker)
      var icon = picker.find('.selected-icon use').attributes('href')
      expect(icon).toContain('#denied')
    })

    test('shows the currently picked icon', () => {
      var picker = shallowMount(IconPicker, {
        computed: {
          previewIcon() { return 'testicon' }
        }
      })
      var icon = picker.find('.selected-icon use').attributes('href')
      expect(icon).toContain('#testicon')
    })
  })

  describe('interaction', () => {
    test('opens the modal when open is set to true', () => {
      var picker = shallowMount(IconPicker, { propsData: { open: false } })
      expect(picker.contains('.toolbar-modal')).toBe(false)

      picker.setProps({ open: true })
      expect(picker.contains('.toolbar-modal')).toBe(true)
    })

    test('calls #select when an icon is clicked', () => {
      var fakeSelect = jest.fn()
      var picker = mount(IconPicker, {
        propsData: {
          open: true
        },
        methods: {
          select: fakeSelect
        }
      })
      var anSvg = picker.findAll('svg').at(1)

      anSvg.trigger('click')
      expect(fakeSelect).toBeCalled()
    })

    test('call #select with null when denied is clicked', () => {
      var fakeSelect = jest.fn()
      var picker = mount(IconPicker, {
        propsData: {
          open: true,
          selected: 'faketile'
        },
        methods: {
          select: fakeSelect
        }
      })

      var deniedSvg = picker.find('.chooseEmpty')

      deniedSvg.trigger('click')

      expect(fakeSelect).toBeCalledWith(null)
    })
  })

  describe('computed', () => {
    describe('empty', () => {
      it('indicates whether an icon is chosen', () => {
        var localThis = {
          selected: null
        }
        expect(IconPicker.computed.empty.call(localThis)).toBe(true)

        localThis.selected = 'anicon'
        expect(IconPicker.computed.empty.call(localThis)).toBe(false)
      })
    })

    describe('previewIcon', () => {
      it('returns the selected icon', () => {
        var localThis = {
          selected: 'anicon'
        }
        expect(IconPicker.computed.previewIcon.call(localThis)).toBe('anicon')
      })

      it('returns denied when no icon is selected', () => {
        expect(IconPicker.computed.previewIcon.call({})).toBe('denied')
      })
    })
  })

  describe('methods', () => {
    describe('select', () => {
      it('calls onUpdate if a new icon is selected', () => {
        var fakeOnUpdate = jest.fn()
        var fakeEmit = jest.fn()
        var localThis = {
          onUpdate: fakeOnUpdate,
          '$emit': fakeEmit,
          selected: 'a'
        }

        IconPicker.methods.select.call(localThis, 'b')
        expect(fakeOnUpdate).toBeCalled
      })

      it('emits close if a new icon is selected', () => {
        var fakeOnUpdate = jest.fn()
        var fakeEmit = jest.fn()
        var localThis = {
          onUpdate: fakeOnUpdate,
          '$emit': fakeEmit,
          selected: 'a'
        }

        IconPicker.methods.select.call(localThis, 'b')
        expect(fakeEmit).toBeCalledWith('close')
      })

      it('does not emit close if the same icon is chosen', () => {
          var fakeOnUpdate = jest.fn()
          var fakeEmit = jest.fn()
          var localThis = {
            onUpdate: fakeOnUpdate,
            '$emit': fakeEmit,
            selected: 'a'
          }

          IconPicker.methods.select.call(localThis, 'a')
          expect(fakeEmit.mock.calls.length).toBe(0)
      })

      it('calls onUpdate with null if the same icon is chosen', () => {
        var fakeOnUpdate = jest.fn()
        var fakeEmit = jest.fn()
        var localThis = {
          onUpdate: fakeOnUpdate,
          '$emit': fakeEmit,
          selected: 'a'
        }

        IconPicker.methods.select.call(localThis, 'a')
        expect(fakeOnUpdate).toBeCalledWith(null)
      })
    })
  })
})
