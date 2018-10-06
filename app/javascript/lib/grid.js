import SVG from 'svg.js'
import { extendHex, defineGrid } from 'honeycomb-grid'
import Tile from './tile.js'
import Cable from './cable.js'

const DEBUG_LOG = false

export default class Grid {
  constructor (element, store) {
    this.draw = SVG(element)
    this.hexSize = 20
    this.store = store

    this.watch()
  }

  debugLog() {
    if (DEBUG_LOG) {
      console.log.apply(console, arguments)
    }
  }

  watch () {
    this.store.watch((state) => {
      return state.map ? `${state.map.id}_${state.activeLayoutId}` : null
    }, () => {
      var layout = this.store.getters.activeLayout;
      if (layout) {
        this.drawGrid(layout.height, layout.width, layout.grid)
      }
    });
  }

  drawGrid (height, width, tiles) {
    if(this.grid) return

    this.tiles = tiles;

    this.hexFactory = extendHex({ size: this.hexSize })
    this.gridFactory = defineGrid(this.hexFactory)

    this.grid = this.gridFactory.rectangle({ width: width, height: height })
    this.grid.forEach((hex, index) => {
      var tile = new Tile(hex, this, this.store);
      hex.set({
        tile: tile,
        x: hex.x,
        y: hex.y
      })
    })
  }

  // Implements a modified Forest-Fire algorithm
  fillFrom(hex) {
    if (!hex.tile.wouldDraw()) { return }
    var target = Object.assign({}, hex.tile.features())
    var queue = [hex]
    hex.set({ toFill: true, x: hex.x, y: hex.y })
    var toFill = [Object.assign({}, hex.tile.drawParams(), { index: hex.tile.index() })]
    var traversalDirections = ['NE','NW','E','W','SE','SW']

    // We will continue appending new edge nodes here until we stop seeing matching tiles
    while(queue.length) {
      var initialHex = queue.shift()

      // Traverse in a straight line in each cardinal direction from the root node
      traversalDirections.forEach(dir => {
        var curHex = initialHex

        // Continue traversing in a line until you stop seeing matching nodes
        while(curHex = this.grid.neighborsOf(curHex, dir)[0]) {
          if (curHex.toFill || !curHex.tile.matches(target)) { return }
          curHex.set({ toFill: true, x: curHex.x, y: curHex.y })
          toFill.push(Object.assign({}, curHex.tile.drawParams(), { index: curHex.tile.index() }))

          // For each node in the line, check its neighbors to see if they match, and add them as new edge nodes
          var neighborsToCheck = traversalDirections.filter(t => { return t !== dir })
          this.grid.neighborsOf(curHex, neighborsToCheck).forEach(n => {

            if (!n.toFill && n.tile.matches(target)) {
              toFill.push(Object.assign({}, n.tile.drawParams(), { index: n.tile.index() }))
              n.set({ toFill: true, x: n.x, y: n.y })
              queue.push(n)
            }
          })
        }

        curHex = initialHex
      })
    }

    toFill.forEach(data => {
      var tile = this.grid.get(data.index)
      tile.set({ toFill: undefined, x: tile.x, y: tile.y })
    })

    this.store.commit('updateTile', toFill)
    Cable.sendLayoutUpdate(toFill)
  }
}
