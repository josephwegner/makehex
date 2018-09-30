import Vuex from 'vuex'
import Vue from 'vue'

export default class Storestore {
  constructor() {
    this.store = new Vuex.Store({
      state: {
        map: null,
        activeLayoutId: null
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

         /*
         var layout = state.map.layouts.find((layout) => {
           return layout.id === state.activeLayoutId
         })

         layout.grid[payload.index] = Object.assign({}, layout.grid[payload.index], payload)
         delete layout.grid[payload.index].index
         console.log(layout.grid[payload.index])
         */
       },

       updateLayoutGrid(state, payload) {
         state.map.layouts.find((layout) => {
           return layout.id === payload.layout
         }).grid = payload.grid
       }
     }
    })
  }
}
