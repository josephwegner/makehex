import Cable from './cable.js'

function defaultTileFeatures() {
  return {
    color: '#FFFFFF',
    icon: null,
    fog: false
  }
}

export default class Tile {



  constructor(hex, grid, store) {
    this.hex = hex
    this.grid = grid
    this.store = store


    const { x, y } = this.hex.toPoint()
    this.ele = this.grid.mainGroup.group()
      .translate(x, y)

    this.watch()
    this.render()
  }

  watch() {
    this.store.watch((state, getters) => {
      // This is some hacky shit right here, but it is the fastest way I can find
      // to diff the objects
      // I would be very open to suggestions of better ways to do this
      var tile = getters.activeLayout.grid[this.index()]
      if (!tile) { return null; }

      return Object.values(Object.getOwnPropertyDescriptors(tile))
        .map(p => { return p.hasOwnProperty('value') ? null : p.get() })
        .join('_')
    }, this.render.bind(this))
  }

  render() {
    this.ele.clear()
    var features = this.features()

    if (!features.fog || this.store.state.editor) {
      var poly = this.ele.polygon(this.hex.corners().map(({ x, y }) => `${x},${y}`))
        .stroke({ width: 1, color: '#999' })
        .fill(features.color)

      this.ele.click(this.onClick.bind(this))

      if (features.icon) {
        this.ele.use(features.icon, '/packs/tilecons.svg')
            .size(this.hex.width(), this.hex.height())
      }

      if (features.fog) {
        poly.attr('mask', 'url(#fog)')
      }
    } else {
      this.ele.polygon(this.hex.corners().map(({ x, y }) => `${x},${y}`))
        .stroke({ width: 1, color: '#999' })
        .fill('#888')
        .attr('mask', 'url(#fog)')
    }
  }

  index() {
    return (this.store.getters.activeLayout.width * this.hex.y) + this.hex.x
  }

  features() {
    if (this.store.getters.activeLayout) {
      var tile = this.store.getters.activeLayout.grid[this.index()]
      return tile ? tile : defaultTileFeatures()
    }
    return defaultTileFeatures()
  }

  wouldDraw() {
    return this.store.state.tool.type !== 'draw' || !this.matches(this.store.state.tool)
  }

  matches(matchAgainst, matchType) {
    var s = Date.now()
    var features = this.features()
    var unmatched = ['color', 'icon', 'fog'].filter(feature => {
      var val = features[feature] === undefined ? null : features[feature]
      var match = matchAgainst[feature] === undefined ? null : matchAgainst[feature]

      return val !== match
    })

    return unmatched.length === 0
  }

  draw(forceDraw = false) {
    if (!forceDraw && !this.wouldDraw()) { return }

    var data = Object.assign(this.drawParams(), { index: this.index() })

    this.store.commit('updateTile', data)
    Cable.sendTileUpdate(data)
  }

  drawParams() {
    var data = Object.assign({}, this.features())
    switch (this.store.state.tool.type) {
      case 'design':
        for(var prop of this.designProps) {
          data[prop] = this.store.state.tool[prop]
        }
        break;

      case 'fog':
        data.fog = this.store.state.tool.type === 'erase' ? false : true
        break;
    }

    return data
  }

  erase() {
    var currentFeatures = this.features()
    var newFeatures = {
      index: this.index()
    }

    switch (this.store.state.tool.type) {
      case 'design':
        Object.assign(newFeatures, defaultTileFeatures(), {fog: currentFeatures.fog})
        break

      case 'fog':
        Object.assign(newFeatures, currentFeatures, {fog: false})
        break
    }

    this.store.commit('updateTile', newFeatures)
    Cable.sendTileUpdate(newFeatures)
  }

  onClick() {
    if (!this.store.state.editor) { return }
    switch (this.store.state.tool.coverage) {
      case 'single':
        this.draw()
        break;

      case 'fill':
        console.log('before', JSON.stringify(this.store.getters.activeLayout.grid))
        this.grid.fillFrom(this.hex)
        console.log('after', JSON.stringify(this.store.getters.activeLayout.grid))
        break;

      case  'erase':
        this.erase()
        break;
    }
  }
}

Tile.prototype.designProps = ['color', 'icon']
