import Vuex from 'vuex'
import Vue from 'vue'

export default class Storestore {
  constructor() {
    this.store = new Vuex.Store({
      state: {
        editor: false,
        map: null,
        activeLayoutId: null,
        tool: {
          color: '#008000',
          icon: null,
          type: 'design',
          coverage: 'single'
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
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })
          var tile = layout.grid[payload.index]

          if(tile) {
            for (var feature in payload) {
              if (feature === 'index') continue
              if (tile.hasOwnProperty(feature)) {
                tile[feature] = payload[feature]
              } else {
                Vue.set(tile, feature, payload[feature])
              }
            }
          } else {
            var features = Object.assign({}, payload)
            var index = features.index
            delete features.index

            Vue.set(layout.grid, index, features)
          }
       },

       updateLayoutGrid(state, payload) {
         state.map.layouts.find((layout) => {
           return layout.id === payload.layout
         }).grid = payload.grid
       },

       updateTool(state, payload) {
         state.tool[payload.type] = payload.value
       },

       setEditor(state, payload) {
         state.editor = payload
       }
     }
    })
  }
}
