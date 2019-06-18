import Vuex from 'vuex'
import Vue from 'vue'
import Cable from './cable.js'
import GridEvents from './grid-events.js'
import utils from './utils.js'

export default class Store {
  constructor(props) {
    this.store = new Vuex.Store({
      state: {
        activeLayoutId: null,
        editor: false,
        map: null,
        mapCode: props.mapCode,
        modal: {
          open: false,
          component: null
        },
        player: props.player === 'dm' ? props.player : parseInt(props.player),
        undoState: {
          undoCount: 0,
          redoCount: 0
        },
        selectedHex: null,
        hoveredHex: null,
        tool: {
          color: '#008000',
          icon: null,
          type: 'design',
          coverage: 'single',
          fogType: 'fog'
        }
      },

      actions: {
        async addEntity ({ commit, dispatch, getters, state }, payload) {
          var layout = getters.activeLayout
          var hex = state.selectedHex
          var index = (layout.width * hex.r) + Math.floor(hex.r / 2) + hex.q

          await commit('addEntity', payload)
          dispatch('sendTileUpdate', hex)
        },

        async sendTileUpdate ({ getters }, coords) {
          Cable.sendTileUpdate(coords)
        },

        eraseTile ({commit, state, getters}, coords) {
          var newFeatures = {}
          newFeatures[coords.q] = {}
          newFeatures[coords.q][coords.r]= utils.defaultTile()

          commit('updateTile', { tiles: newFeatures, source: 'editor' })
          Cable.sendTileUpdate(coords)
        },

        drawTile ({ commit, state, getters }, coords) {
          var tile = getters.activeLayout.grid[coords.q][coords.r] || {}
          var props = {
            color: tile.color,
            fog: tile.fog,
            icon: tile.icon
          }

          switch(state.tool.type) {
            case 'design':
              props.color = state.tool.color
              props.icon = state.tool.icon
              break

            case 'fog':
              props.fog = state.tool.fogType === 'fog' ? true : false
              break
          }

          var data = {}
          data[coords.q] = {}
          data[coords.q][coords.r] = props

          commit('updateTile', { tiles: data, source: 'editor' })
          Cable.sendTileUpdate(coords)
        },

        movePlayer({ getters }, coords) {
          Cable.updatePlayer({
            id: getters.player.id,
            layout: getters.activeLayout.id,
            q: coords.q,
            r: coords.r
          })
        },

        overwrite ({ commit }, data) {
          commit('updateTile', { tiles: data, source: 'overwrite' })
          var coords = []
          utils.iterateOverGrid(data, (tile, tileCoords) => {
            coords.push(tileCoords)
          })
          Cable.sendTileUpdate(coords)
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

        activeColors: state => {
          if (!state.map || !state.activeLayoutId) return {}
          var layout = state.map.layouts.find(layout => {
            return layout.id === state.activeLayoutId
          })

          var colorObj = {}
          utils.iterateOverGrid(layout.grid, (tile) => {
            if (tile.color) {
              colorObj[tile.color] = true
            }
          })

          return Object.keys(colorObj)
        },

        player: state => {
          if (!state.map) return null
          if (state.player === 'dm') return null

          return state.map.players.find(player => {
            return player.id === state.player
          })
        },

        selectedHex: state => {
          if (!state.map || !state.activeLayoutId) return {}
          var layout = state.map.layouts.find(layout => {
            return layout.id === state.activeLayoutId
          })

          if (state.selectedHex) {
            var hex = state.selectedHex
            return layout.grid[hex.q][hex.r] || {}
          }
        }
      },

      mutations: {

        addBottom (state) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })

          var newGrid = Object.assign({}, layout.grid)
          var q = Math.floor((layout.height - 1) / -2)
          var maxQ = layout.width + q
          while (q < maxQ) {
            if (newGrid[q] === undefined) {
              newGrid[q] = {}
            }

            newGrid[q][layout.height] = utils.defaultTile()
            q++
          }

          layout.height++
          layout.grid = newGrid

          Cable.pushLayout(layout)
        },

        addEntity(state, payload) {
          if (!state.selectedHex) { return }
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })
          var selectedHex = state.selectedHex
          var newGrid = {}
          newGrid[selectedHex.q] = layout.grid[selectedHex.q] || {}

          var hex = layout.grid[selectedHex.q][selectedHex.r]

          if(!hex.entities) {
            hex.entities = {}
          }

          var entities = Object.assign({}, hex.entities, payload)
          newGrid[selectedHex.q][selectedHex.r] = Object.assign({}, hex, {
            entities: entities
          })

          layout.grid = Object.assign({}, layout.grid, newGrid)
        },

        addMap (state, map) {
          state.map = map

          // It's a bit nasty, but iterate over the map in x,y coords
          // and fill in any blanks. The reason to do it in x,y
          // is because our map is a rectangle. It's far easier to iterate
          // over a rectangle in x,y than in q,r
          state.map.layouts.forEach(utils.fillEmpties)
        },

        addLayout (state, layout) {
          utils.fillEmpties(layout)
          state.map.layouts.push(layout)
        },

        addLeft (state) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })

          layout.width++
          var newGrid = {}
          Object.keys(layout.grid).forEach((oldQ) => {
            var newQ = parseInt(oldQ) + 1
            newGrid[newQ] = layout.grid[oldQ]
            if (newQ <= 0) {
              newGrid[newQ][newQ * -2] = utils.defaultTile()
              newGrid[newQ][(newQ * -2) + 1] = utils.defaultTile()
            }
          })
          var newQ = Math.floor((layout.height / -2) + 1)

          newGrid[newQ] = {}
          newGrid[newQ][layout.height - 1] = utils.defaultTile()
          if (!(layout.height % 2)) {
            newGrid[newQ][layout.height - 2] = utils.defaultTile()
          }

          layout.grid = newGrid
          Cable.pushLayout(layout)
        },

        addRight (state) {
            var layout = state.map.layouts.find((layout) => {
              return layout.id === state.activeLayoutId
            })

            var newGrid = Object.assign(layout.grid)

            var q = layout.width
            var r = 0
            while (r < layout.height) {
              if (newGrid[q] === undefined) {
                newGrid[q] = {}
              }

              newGrid[q][r] = utils.defaultTile()

              q = layout.width - Math.floor((r + 1) / 2)
              r++
            }

            layout.width++

            layout.grid = newGrid
            Cable.pushLayout(layout)
        },

        addTop (state) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })

          var newGrid = {}
          Object.keys(layout.grid).forEach(q => {
            q = parseInt(q)
            if (!newGrid[q - 1]) { newGrid[q - 1] = {} }
            if (!newGrid[q]) { newGrid[q] = {} }

            Object.keys(layout.grid[q]).forEach(r => {
              r = parseInt(r)
              newGrid[q - 1][r + 2] = layout.grid[q][r]
            })

            if (q >= 0) {
              newGrid[q][0] = utils.defaultTile()
              newGrid[q][1] = utils.defaultTile()
            }
          })
          layout.height += 2

          layout.grid = newGrid
          Cable.pushLayout(layout)
        },

        closeModal (state) {
          state.modal.open = false
          state.modal.component = null
        },

        hoverHex(state, payload) {
          state.hoveredHex = payload
        },

        movePlayer(state, player_updates) {
          var players = []
          state.map.players.forEach(player => {
            if (player.id !== player_updates.id) {
              players.push(player)
            } else {
              player.location_q = player_updates.q
              player.location_r = player_updates.r
              player.layout = player_updates.layout
              players.push(player)
            }
          })

          state.map = Object.assign({}, state.map, { players: players })
        },

        openLayout(state, layoutId) {
          state.activeLayoutId = layoutId
          Cable.connectToTile(layoutId)
        },

        undoStatus(state, payload) {
          state.undoState.undoCount = payload.undoCount
          state.undoState.redoCount = payload.redoCount
        },

        updateTile(state, payload) {
          var layout = state.map.layouts.find((layout) => {
            return layout.id === state.activeLayoutId
          })
          var changes = {}
          var finalValues = {}

          utils.iterateOverGrid(payload.tiles, (updates, coords) => {
            var tile = layout.grid[coords.q][coords.r] || {}

            if (!changes[coords.q]) {
              changes[coords.q] = {}
              finalValues[coords.q] = {}
            }

            if (updates === null) {
              changes[coords.q][coords.r] = utils.defaultTile()
              finalValues[coords.q][coords.r] = utils.defaultTile()
            } else {
              changes[coords.q][coords.r] = Object.assign(
                {q: coords.q, r: coords.r},
                tile
              )
              finalValues[coords.q][coords.r] = Object.assign({}, tile, updates)
            }
          })

          var newGrid = {}
          for (var q in finalValues) {
            newGrid[q] = Object.assign({}, layout.grid[q], finalValues[q])
          }
          layout.grid = Object.assign({}, layout.grid, newGrid)

          if (['server', 'overwrite'].indexOf(payload.source) === -1) {
            GridEvents.changed(changes)
          }
       },

       updateLayoutGrid(state, payload) {
         var layout = state.map.layouts.find((layout) => {
           return layout.id === payload.layout
         })

         // It's a bit nasty, but iterate over the map in x,y coords
         // and fill in any blanks. The reason to do it in x,y
         // is because our map is a rectangle. It's far easier to iterate
         // over a rectangle in x,y than in q,r
         for (var x=0; x<layout.width; x++) {
           for (var y=0; y<layout.height; y++) {
             var index = (y*layout.width) + x

             var r =  Math.floor(index  / layout.width)
             var qOffset = Math.ceil(r / -2)
             var q = (index % layout.width) + qOffset

             if (!payload.grid[q]) {
               payload.grid[q] = {}
             }
             if(!payload.grid[q][r]) {
               payload.grid[q][r] = utils.defaultTile()
             }
           }
         }

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
         if (!state.editor) {
           state.tool.type = 'player'
         }
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
     },

     plugins: [GridEvents.addStore.bind(GridEvents)]
    })
  }
}
