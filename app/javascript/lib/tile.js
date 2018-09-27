export default class Tile {
  constructor(hex, grid, color, store) {
    this.hex = hex
    this.grid = grid
    this.color = color
    this.store = store

    this.watch()
    this.render()
  }

  watch() {
    this.store.watch((state, getters) => {
      return getters.activeLayout.grid[this.index()].color
    }, this.updateColor.bind(this))
  }

  render() {
    const { x, y } = this.hex.toPoint()

    this.poly = this.grid.draw
      .polygon(this.hex.corners().map(({ x, y }) => `${x},${y}`))
      .fill(this.color)
      .stroke({ width: 1, color: '#999' })
      .translate(x, y)
      .click(this.onClick.bind(this))
  }

  index() {
    return this.grid.grid.indexOf(this.hex)
  }

  updateColor(color) {
    this.poly.fill(color)
  }

  onClick() {
    console.log(this.index())
    this.store.commit('updateTile', {
      index: this.index(),
      color: 'green'
    })
  }
}
