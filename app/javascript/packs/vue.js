/* eslint no-console:0 */
import Vue from 'vue/dist/vue.js'
import Map from '../components/map.vue'

document.addEventListener('DOMContentLoaded', () => {
  const editor = new Vue({
    el: '.map',
    template: '<Map/>',
    components: { Map }
  })
})
