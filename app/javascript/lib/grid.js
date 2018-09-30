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
}
