/* eslint no-console:0 */
import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import Map from '../components/map.vue'
import API from '../lib/api.js'
import Cable from '../lib/cable.js'
import Store from '../lib/store.js'

Vue.use(Vuex)

document.addEventListener('DOMContentLoaded', () => {
  const editor = new Vue({
    el: '.map',
    store: new Store().store,
    template: '<Map/>',
    components: { Map },
    beforeCreate: function() {
      var mapId = document.getElementsByClassName('editor')[0].getAttribute('data-map-id')
      API.getMap(mapId).then((map) => {
        this.$store.commit('addMap', map)
        this.$store.commit('openLayout', map.default_layout_id)
      })
      Cable.loadMap(mapId, this.$store)
    }
  })
})
