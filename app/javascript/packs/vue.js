/* eslint no-console:0 */
import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import Map from '../components/map.vue'
import Tools from '../components/tools.vue'
import API from '../lib/api.js'
import Cable from '../lib/cable.js'
import Store from '../lib/store.js'

Vue.use(Vuex)

document.addEventListener('DOMContentLoaded', () => {
  var store = new Store().store
  const editor = new Vue({
    el: '.map',
    store: store,
    template: '<Map/>',
    components: { Map },
    beforeCreate: function() {
      var mapId = document.getElementsByClassName('editor')[0].getAttribute('data-map-id')
      API.getMap(mapId).then((map) => {
        this.$store.commit('addMap', map)
        this.$store.commit('openLayout', map.default_layout_id)
      })
      Cable.loadStore(this.$store)
    }
  })

  const tools = new Vue({
    el: '.footer-tools',
    store: store,
    template: '<Tools/>',
    components: { Tools }
  })
})
