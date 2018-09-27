export default class Tile {
  constructor(hex, draw, color) {
    this.hex = hex;
    this.draw = draw;

    this.render()
  }

  render() {
    const { x, y } = this.hex.toPoint()

    this.poly = this.draw
      .polygon(this.hex.corners().map(({ x, y }) => `${x},${y}`))
      .fill('blue')
      .stroke({ width: 1, color: '#999' })
      .translate(x, y)
      .click(this.onClick.bind(this))
  }

  onClick() {
    console.log('click')
    this.poly.fill('green')
  }
}
