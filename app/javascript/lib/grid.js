import SVG from 'svg.js'
import { extendHex, defineGrid } from 'honeycomb-grid'
import Tile from './tile.js'

export default class Grid {
  constructor (element, store) {
    this.draw = SVG(element)
    this.hexSize = 20
    this.store = store

    this.watch()
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
    hex.tile.draw(true)
    var queue = [hex]
    var traversalDirections = ['NE','NW','E','W','SE','SW']

    while(queue.length) {
      var initialHex = queue.shift()
      traversalDirections.forEach(dir => {
        var curHex = initialHex
        while(curHex = this.grid.neighborsOf(curHex, dir)[0]) {
          if (!curHex.tile.matches(target, this.store.state.tool.type)) { return }
          curHex.tile.draw(true)

          this.grid.neighborsOf(curHex).forEach(n => {
            if (n.tile.matches(target, this.store.state.tool.type)) {
              n.tile.draw(true)
              queue.push(n)
            }
          })
        }

        curHex = initialHex
      })
    }
  }
}
