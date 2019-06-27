/* eslint no-console:0 */
import '@babel/polyfill'
import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import Map from '../components/map.vue'
import Toolbar from '../components/toolbar.vue'
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
  var mapCode = root.getAttribute('data-map-code')
  var player = root.getAttribute('data-player')

  var store = new Store({
    mapCode: mapCode,
    player: player
  }).store

  Vue.prototype.$eventHub = new Vue();
  const editor = new Vue({
    el: '.map',
    store: store,
    template: '<Map/>',
    components: { Map },
    beforeCreate: function() {
      this.$store.commit('setEditor', player === 'dm')
      API.getMap(mapId).then((map) => {
        this.$store.commit('addMap', map)
        this.$store.commit('openLayout', map.default_layout_id)

        var color;
        if (this.$store.getters.activeColors.length) {
          color = this.$store.getters.activeColors[0]
        } else {
          color = '#297C46';
        }
        
        this.$store.commit('updateDrawTool', {color: color})
      })
      Cable.loadStore(this.$store)
    }
  })

  if (player === 'dm') {
    const toolbar = new Vue({
      el: '.toolbar',
      store: store,
      template: '<Toolbar />',
      components: { Toolbar }
    })
  }
})
