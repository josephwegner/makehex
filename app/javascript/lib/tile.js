import Cable from './cable.js'

function defaultTileFeatures() {
  return {
    color: '#FFFFFF',
    icon: null
  }
}

export default class Tile {
  constructor(hex, grid, store) {
    this.hex = hex
    this.grid = grid
    this.store = store


    const { x, y } = this.hex.toPoint()
    this.ele = this.grid.draw.group()
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

    this.ele.polygon(this.hex.corners().map(({ x, y }) => `${x},${y}`))
      .stroke({ width: 1, color: '#999' })
      .fill(features.color)

    this.ele.click(this.onClick.bind(this))

    if (features.icon) {
      this.ele.use(features.icon, '/packs/tilecons.svg')
          .size(this.hex.width(), this.hex.height())
    }
  }

  index() {
    return this.grid.grid.indexOf(this.hex)
  }

  features() {
    if (this.store.getters.activeLayout) {
      var tile = this.store.getters.activeLayout.grid[this.index()]
      return tile ? tile : defaultTileFeatures()
    }
    return defaultTileFeatures()
  }

  wouldDraw() {
    return !this.matches(this.store.state.tool)
  }

  matches(matchAgainst) {
    var features = this.features()
    var unmatched = ['color', 'icon'].filter(feature => {
      var val = features[feature] === undefined ? null : features[feature]
      var match = matchAgainst[feature] === undefined ? null : matchAgainst[feature]
      return val !== match
    })
    return unmatched.length === 0
  }

  draw(forceDraw = false) {
    if (!forceDraw && !this.wouldDraw()) { return }

    var data = {
      index: this.index(),
      color: this.store.state.tool.color,
      icon: this.store.state.tool.icon
    };

    this.store.commit('updateTile', data)
    Cable.sendLayoutUpdate(data)
  }

  onClick() {
    switch (this.store.state.tool.type) {
      case 'single':
        this.draw()
        break;

      case 'fill':
        this.grid.fillFrom(this.hex)
        break;

      case  'empty':
        break;
    }
  }
}
