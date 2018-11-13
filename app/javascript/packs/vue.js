/* eslint no-console:0 */
import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import Map from '../components/map.vue'
import Tools from '../components/tools.vue'
import API from '../lib/api.js'
import Cable from '../lib/cable.js'
import Store from '../lib/store.js'

Vue.use(Vuex)

//load directives
import FocusInput from '../directives/focus-input.js'
FocusInput(Vue)

document.addEventListener('DOMContentLoaded', () => {
  var root = document.getElementsByClassName('map-root')[0]
  var mapId = root.getAttribute('data-map-id')
  var isEditor = root.getAttribute('data-editor') === 'true'

  var store = new Store().store
  const editor = new Vue({
    el: '.map',
    store: store,
    template: '<Map/>',
    components: { Map },
    beforeCreate: function() {
      this.$store.commit('setEditor', isEditor)
      API.getMap(mapId).then((map) => {
        this.$store.commit('addMap', map)
        this.$store.commit('openLayout', map.default_layout_id)
      })
      Cable.loadStore(this.$store)
    }
  })

  if (isEditor) {
    const tools = new Vue({
      el: '.footer-tools',
      store: store,
      template: '<Tools/>',
      components: { Tools }
    })
  }
})
