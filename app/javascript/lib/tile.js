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
    this.objectsWithListeners = []


    const { x, y } = this.hex.toPoint()
    this.ele = this.grid.mainGroup.group()
      .translate(x, y)

    this.watch()
    this.render()
  }

  clearListeners() {
    while(this.objectsWithListeners.length) {
      var obj = this.objectsWithListeners.shift()
      obj.off('click')
    }
  }

  teardown() {
    this.propertyWatcher()
    this.selectedWatcher()
    this.clearListeners()
  }

  watch() {
    this.propertyWatcher = this.store.watch((state, getters) => {
      // This is some hacky shit right here, but it is the fastest way I can find
      // to diff the objects
      // I would be very open to suggestions of better ways to do this
      var tile = getters.activeLayout.grid[this.index()]
      if (!tile) { return null; }

      return Object.values(Object.getOwnPropertyDescriptors(tile))
        .map(p => { return p.hasOwnProperty('value') ? null : p.get() })
        .join('_')
    }, this.render.bind(this))

    this.selectedWatcher = this.store.watch((state, getters) => {
      if (!state.selectedHex) { return false }

      return state.selectedHex.x === this.hex.x && state.selectedHex.y === this.hex.y
    }, this.renderSelectedHex.bind(this))
  }

  render() {
    this.clearListeners()
    this.ele.clear()
    var features = this.features()

    if (!features.fog || this.store.state.editor) {
      var strokeWidth = 1
      var strokeColor = '#999'
      if (this.store.state.selectedHex) {
        if(this.store.state.selectedHex.x === this.hex.x && this.store.state.selectedHex.y === this.hex.y) {
          strokeWidth = 3
          strokeColor = '#333'
        }
      }

      this.hexPoly = this.ele.polygon(this.hex.corners().map(({ x, y }) => `${x},${y}`))
        .stroke({ width: strokeWidth, color: strokeColor })
        .fill(features.color)

      this.ele.click(this.onClick.bind(this))
      this.objectsWithListeners.push(this.ele)

      if (features.icon) {
        this.ele.use(features.icon, '/packs/tilecons.svg')
            .size(this.hex.width(), this.hex.height())
      }

      this.renderEntities()

      if (features.fog) {
        this.hexPoly.attr('mask', 'url(#fog)')
      }
    } else {
      this.ele.polygon(this.hex.corners().map(({ x, y }) => `${x},${y}`))
        .stroke({ width: 1, color: '#999' })
        .fill('#888')
        .attr('mask', 'url(#fog)')
    }
  }

  renderSelectedHex() {
    var strokeWidth = 1
    var strokeColor = '#999'
    if(this.store.state.selectedHex &&
       this.store.state.selectedHex.x === this.hex.x &&
       this.store.state.selectedHex.y === this.hex.y) {

      strokeWidth = 3
      strokeColor = '#333'
      this.ele.front()
    }

    this.hexPoly.stroke({ width: strokeWidth, color: strokeColor })
  }

  renderEntities() {
    var entities = this.features().entities || {}

    if (entities.in && entities.in.link) {
      var link = this.ele.use('arrow-out-right', '/packs/tilecons.svg')
        .size('20', '20')
        .stroke('#000')
        .attr({ x: this.hex.width() / 4, y: 4 })
        .addClass('clickable-svg')
        .click(this.followLink.bind(this, entities.in.link))
      this.objectsWithListeners.push(link)
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

  followLink(layoutId, ev) {
    ev.stopPropagation()
    this.store.commit('openLayout', layoutId)
  }

  wouldDraw() {
    return this.store.state.tool.type === 'fill' || !this.matches(this.store.state.tool)
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

    if (this.store.state.tool.type === 'hex') {
      this.store.commit('selectHex', {x: this.hex.x, y: this.hex.y })
    } else {
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
}

Tile.prototype.designProps = ['color', 'icon']
