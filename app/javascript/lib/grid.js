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

  watch () {
    this.store.watch((state) => {
      return state.map ? `${state.map.id}_${state.activeLayoutId}` : null
    }, () => {
      var layout = this.store.getters.activeLayout;
      if (layout) {
        this.drawGrid(layout.height, layout.width, layout.grid)
      }
    });

    this.store.watch((state, getters) => {
      if (!getters.activeLayout) { return null }
      return `${getters.activeLayout.width}x${getters.activeLayout.height}`
    }, this.redraw.bind(this))
  }

  drawGrid (tiles) {
    if(this.grid) {
      this.grid.forEach(hex => {
        hex.tile.teardown()
      })

      this.draw.clear()
    }

    this.tiles = tiles;

    this.hexFactory = extendHex({ size: this.hexSize })
    this.gridFactory = defineGrid(this.hexFactory)
    var baseHex = this.hexFactory()

    this.addBottom = this.draw.group()
      .click(this.store.commit.bind(this.store, 'addBottom'))
    this.addRight = this.draw.group()
      .click(this.store.commit.bind(this.store, 'addRight'))
    this.addLeft = this.draw.group()
      .click(this.store.commit.bind(this.store, 'addLeft'))
      .translate(0, baseHex.corners()[1].y * 2)
    this.addTop = this.draw.group()
      .click(this.store.commit.bind(this.store, 'addTop'))
      .translate(0, 0)
    this.mainGroup = this.draw.group()
      .translate(baseHex.width(), baseHex.corners()[1].y * 2)

    this.grid = this.gridFactory.rectangle({
      width: this.store.getters.activeLayout.width,
      height: this.store.getters.activeLayout.height
    })

    this.grid.forEach((hex, index) => {
      var tile = new Tile(hex, this, this.store);
      hex.set({
        tile: tile,
        x: hex.x,
        y: hex.y
      })
    })

    this.resizeSVG()
    this.drawAddLines()
  }

  drawAddLines () {
    var unitsRight = this.store.getters.activeLayout.width
    var unitsDown = this.store.getters.activeLayout.height
    var topRight = this.grid.get(unitsRight - 1)
    var bottomLeft = this.grid.get(unitsRight * (unitsDown - 1) + 1)
    var xOffset = topRight.toPoint().x + topRight.width()
    var yOffset = bottomLeft.toPoint().y + (bottomLeft.corners()[1].y * 2)

    var verticalGrid = this.gridFactory.rectangle({ width: 1, height: unitsDown })
    var horizontalGrid = this.gridFactory.rectangle({ width: unitsRight, height: 1 })
    var doubleHorizontalGrid = this.gridFactory.rectangle({ width: unitsRight, height: 2 })

    this.addBottom
      .translate((bottomLeft.y % 2) !== 0 ? bottomLeft.width() : bottomLeft.width() / 2, yOffset)
      .clear()
    this.addRight
      .translate(xOffset, topRight.corners()[1].y)
      .clear()
    this.addTop.clear()
    this.addLeft.clear()

    verticalGrid.forEach((hex, index) => {
      var points = hex.toPoint()
      this.addRight.polygon(hex.corners().map(({ x, y }) => `${x},${y}`))
        .stroke({ width: 1, color: '#dcdcdc' })
        .fill('#fff')
        .translate(hex.width() + points.x, points.y + hex.corners()[1].y)

      //if (index === 0) return
      this.addLeft.polygon(hex.corners().map(({ x, y }) => `${x},${y}`))
        .stroke({ width: 1, color: '#dcdcdc' })
        .fill('#fff')
        .translate(points.x, points.y)
    })

    horizontalGrid.forEach((hex, index) => {
      if (index === 0) return
      var points = hex.toPoint()
      this.addBottom.polygon(hex.corners().map(({ x, y }) => `${x},${y}`))
        .stroke({ width: 1, color: '#dcdcdc' })
        .fill('#fff')
        .translate(points.x, hex.corners()[1].y + points.y)
    })

    doubleHorizontalGrid.forEach((hex, index) => {
      if (index === 0 || index === unitsRight) return
      var points = hex.toPoint()
      this.addTop.polygon(hex.corners().map(({ x, y }) => `${x},${y}`))
        .stroke({ width: 1, color: '#dcdcdc' })
        .fill('#fff')
        .translate(points.x, points.y)
    })
  }

  // Implements a modified Forest-Fire algorithm
  fillFrom(hex) {
    if (!hex.tile.wouldDraw()) { return }
    var target = Object.assign({}, hex.tile.features())
    var queue = [hex]
    var toFill = [Object.assign({}, hex.tile.drawParams(), { index: hex.tile.index() })]
    var drawParams = hex.tile.drawParams()

    // pre-compute which tiles might match, so we don't have to check on every iteration
    var matchingTiles = this.grid.filter(t => { return t.tile.matches(target) })

    // We will continue appending new edge nodes here until we stop seeing matching tiles
    while(queue.length) {
      var curHex = queue.shift()
      toFill.push(Object.assign({}, drawParams, { index: curHex.tile.index() }))

      var hexCube = curHex.cartesianToCube(curHex)
      matchingTiles = matchingTiles.filter(tile => {
        // Using our own distance function to avoid extra lookups. This gets called
        // A LOT of times, so speed is of the essence
        var tileCube = tile.cartesianToCube(tile)
        var distance = Math.max(
          Math.abs(tileCube.q - hexCube.q),
          Math.abs(tileCube.r - hexCube.r),
          Math.abs(tileCube.s - hexCube.s)
        )
        if (distance == 1) {
          queue.push(tile)
          return false
        } else {
          return true
        }
      })
    }

    this.store.commit('updateTile', toFill)
    Cable.sendTileUpdate(toFill)
  }

  redraw () {
    var width = this.store.getters.activeLayout.width
    var height = this.store.getters.activeLayout.height

    for (var y=0; y < height; y++) {
      for (var x=0; x < width; x++) {
        var index = (y * width) + x

        if (!this.grid.get([x, y])) {
          var hex = this.hexFactory({x, y})
          hex.set({
            x, y,
            tile: new Tile(hex, this, this.store)
          })
          this.grid.splice(index, 0, hex)
        }
      }
    }

    this.drawAddLines()
    this.resizeSVG()
  }

  resizeSVG () {
    var lastHex = this.grid.get(this.grid.length - 1)

    var points = lastHex.toPoint()
    var widthModifier = lastHex.offset === 1 ? 2.5 : 3.5
    var totalWidth = points.x + (lastHex.width() * widthModifier) + 1
    var totalHeight = points.y + (lastHex.height() * 4) + 1
    this.draw.height(totalHeight)
    this.draw.width(totalWidth)
  }
}
