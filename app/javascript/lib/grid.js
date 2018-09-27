import SVG from 'svg.js'
import { extendHex, defineGrid } from 'honeycomb-grid'
import Tile from './tile.js'

export default class Grid {
  constructor (element, size, height, width) {
    this.hexSize = size;
    this.height = height;
    this.width = width;
    this.draw = SVG(element)

    this.initGrid()
  }

  initGrid () {
    this.hexFactory = extendHex({ size: this.hexSize })
    this.gridFactory = defineGrid(this.hexFactory)

    this.grid = this.gridFactory.rectangle({ width: 50, height: 50 })
    this.grid.forEach(hex => {
      hex.set({
        tile: new Tile(hex, this.draw, 'blue')
      })
    })
  }
}
