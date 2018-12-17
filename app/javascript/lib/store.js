import Vuex from 'vuex'
import Vue from 'vue'
import Cable from './cable.js'

export default class Storestore {
  constructor() {
    this.store = new Vuex.Store({
      state: {
        activeLayoutId: null,
        editor: false,
        map: null,
        modal: {
          open: false,
          component: null
        },
        selectedHex: null,
        hoveredHex: null,
        tool: {
          color: '#008000',
          icon: null,
          type: 'design',
          coverage: 'single'
        }
      },

      actions: {
        async addEntity ({ commit, dispatch, getters, state }, payload) {
          var layout = getters.activeLayout
          var hex = state.selectedHex
          var index = (layout.width * hex.r) + Math.floor(hex.r / 2) + hex.q

          await commit('addEntity', payload)
          dispatch('sendTileUpdate', index)
        },

        async sendTileUpdate ({ getters }, index) {
          Cable.sendTileUpdate(index)
        },

        eraseTile ({commit, state, getters}, index) {
          var tile = getters.activeLayout.grid[index] || {}
          var newFeatures = {
            index: index
          }
          var currentFeatures = {
            color: tile.color,
            fog: tile.fog,
            icon: tile.icon
          }

          switch (state.tool.type) {
            case 'design':
              Object.assign(newFeatures, {fog: currentFeatures.fog}, {
                icon: null,
                color: '#FFFFFF'
              })
              break

            case 'fog':
              Object.assign(newFeatures, currentFeatures, {fog: false})
              break
          }

          commit('updateTile', newFeatures)
          Cable.sendTileUpdate(index)
        },

        drawTile ({ commit, state, getters }, index) {
          var tile = getters.activeLayout.grid[index] || {}
          var data = {
            color: tile.color,
            fog: tile.fog,
            icon: tile.icon,
            index: index
          }

          switch(state.tool.type) {
            case 'design':
              data.color = state.tool.color || data.color
              data.icon = state.tool.icon || data.icon
              break

            case 'fog':
              data.fog = state.tool.coverage === 'erase' ? false : true
              break
          }

          commit('updateTile', data)
          Cable.sendTileUpdate(index)
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
        },

        selectedHex: state => {
          if (!state.map || !state.activeLayoutId) return {}
          var layout = state.map.layouts.find(layout => {
            return layout.id === state.activeLayoutId
          })

          if (state.selectedHex) {
            var hex = state.selectedHex
            var index = (layout.width * hex.r) + Math.floor(hex.r / 2) + hex.q
            var selectedHex = layout.grid[index]

            return selectedHex ? selectedHex : {}
          }
        }
      },

      mutations: {

        addBottom (state) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })

          var newTiles = new Array(layout.width)
          newTiles.fill(null)
          layout.grid = layout.grid.concat(newTiles)
          layout.height++

          Cable.pushLayout(layout)
        },

        addEntity(state, payload) {
          if (!state.selectedHex) { return }
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })
          var hex = state.selectedHex
          var index = (layout.width * hex.r) + Math.floor(hex.r / 2) + hex.q
          if (!layout.grid[index]) {
            layout.grid[index] = {}
          }
          var hex = layout.grid[index]

          if(!hex.entities) {
            hex.entities = {}
          }

          var entities = Object.assign({}, hex.entities, payload)
          layout.grid.splice(index, 1, Object.assign({}, hex, {
            entities: entities
          }))
        },

        addMap (state, map) {
          state.map = map
          state.map.layouts.forEach(layout => {
            var empty = new Array(layout.width * layout.height).fill({})
            layout.grid = empty.map((cell, index) => {
              return layout.grid[index] || {}
            })
          })
        },

        addLayout (state, layout) {
          state.map.layouts.push(layout)
        },

        addLeft (state) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })

          var oldWidth = layout.width
          var insertAt = layout.width * layout.height - oldWidth

          while(insertAt >= 0) {
            layout.grid.splice(insertAt, 0, null)
            insertAt -= oldWidth
          }
          layout.width++

          Cable.pushLayout(layout)
        },

        addRight (state) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })

          var oldWidth = layout.width
          var insertAt = layout.width * layout.height

          while(insertAt > 0) {
            layout.grid.splice(insertAt, 0, null)
            insertAt -= oldWidth
          }
          layout.width++

          Cable.pushLayout(layout)
        },

        addTop (state) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })

          var newTiles = new Array(layout.width * 2)
          newTiles.fill(null)
          layout.grid = newTiles.concat(layout.grid)
          layout.height += 2

          Cable.pushLayout(layout)
        },

        closeModal (state) {
          state.modal.open = false
          state.modal.component = null
        },

        hoverHex(state, payload) {
          state.hoveredHex = payload
        },

        openLayout(state, layoutId) {
          state.activeLayoutId = layoutId
          Cable.connectToTile(layoutId)
        },

        updateTile(state, payload) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })
          if (!payload.length) {
            payload = [payload]
          }

          payload.forEach(updates => {
            var tile = layout.grid[updates.index] || {}
            var index = updates.index
            var finalValues = Object.assign({}, tile, updates)
            delete finalValues.index
            layout.grid.splice(index, 1, finalValues)
          })
       },

       updateLayoutGrid(state, payload) {
         var layout = state.map.layouts.find((layout) => {
           return layout.id === payload.layout
         })

         payload.grid.forEach(layout => {
           var empty = new Array(layout.width * layout.height).fill({})
           payload.grid = empty.map((cell, index) => {
             return payload.grid[index] || {}
           })
         })

         layout.grid = payload.grid
       },

       updateTool(state, payload) {
         if (state.tool.type === 'hex' && payload.type === 'type' && payload.value !== 'hex') {
           state.selectedHex = null
         }

         state.tool[payload.type] = payload.value
       },

       selectHex(state, payload) {
         state.selectedHex = payload
       },

       setDefaultLayout(state, payload) {
         state.map.default_layout_id = payload
       },

       setEditor(state, payload) {
         state.editor = payload
       },

       setLayoutName(state, payload) {
         state.map.layouts.find((layout) => {
           return layout.id === state.activeLayoutId
         }).name = payload
       },

       setMapName(state, payload) {
         state.map.name = payload
       },

       showModal(state, payload) {
         state.modal.open = true
         state.modal.component = payload
       }
     }
    })
  }
}
