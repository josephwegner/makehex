import Cable from './cable.js'

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
      return this.store.getters.activeLayout.grid[this.index()]
    }
    return {}
  }

  onClick() {
    var data = {
      index: this.index(),
      color: this.store.state.tool.color,
      icon: this.store.state.tool.icon
    };

    this.store.commit('updateTile', data)
    Cable.sendLayoutUpdate(data)
  }
}
