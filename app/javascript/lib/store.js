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
          if (!payload.length) {
            payload = [payload]
          }

          payload.forEach(updates => {
            var tile = layout.grid[updates.index]

            if(tile) {
              for (var feature in updates) {
                if (feature === 'index') continue
                if (tile.hasOwnProperty(feature)) {
                  tile[feature] = updates[feature]
                } else {
                  Vue.set(tile, feature, updates[feature])
                }
              }
            } else {
              var features = Object.assign({}, updates)
              var index = updates.index

              Vue.set(layout.grid, index, Object.assign({}, updates, { index: undefined }))
            }
          })
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
