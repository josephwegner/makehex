import '@babel/polyfill'
import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import Store from '../lib/store.js'
import Grid from '../components/grid.vue'

Vue.use(Vuex)

exports.Vue = Vue
exports.Store = Store
exports.Grid = Grid
