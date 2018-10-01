import Vuex from 'vuex'
import Vue from 'vue'

export default class Storestore {
  constructor() {
    this.store = new Vuex.Store({
      state: {
        map: null,
        activeLayoutId: null,
        tool: {
          color: '#008000',
          icon: null,
          type: 'single'
        }
      },

      getters: {
        activeLayout: state => {
          if (state.map) {
             return state.map.layouts.find(layout => {
               return layout.id === state.activeLayoutId
             })
          }

          return null
        }
      },

      mutations: {
        addMap (state, map) {
          state.map = map
        },

        openLayout(state, layoutId) {
          state.activeLayoutId = layoutId
        },

        updateTile(state, payload) {
          var tile = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          }).grid[payload.index]

          for (var feature in payload) {
            if (feature === 'index') continue
            if (tile.hasOwnProperty(feature)) {
              tile[feature] = payload[feature]
            } else {
              Vue.set(tile, feature, payload[feature])
            }
          }
       },

       updateLayoutGrid(state, payload) {
         state.map.layouts.find((layout) => {
           return layout.id === payload.layout
         }).grid = payload.grid
       },

       updateTool(state, payload) {
         state.tool[payload.type] = payload.value
       }
     }
    })
  }
}
