const utils = {
  FILL_PROPS: ['color', 'icon'],

  defaultTile() {
    return {
      color: utils.constants.TILE.color,
      fog: utils.constants.TILE.fog,
      icon: utils.constants.TILE.icon,
      entities: {}
    }
  },

  fillEmpties(layout) {
    for (var x=0; x<layout.width; x++) {
      for (var y=0; y<layout.height; y++) {
        var index = (y*layout.width) + x

        var r =  Math.floor(index  / layout.width)
        var qOffset = Math.ceil(r / -2)
        var q = (index % layout.width) + qOffset

        if (!layout.grid[q]) {
          layout.grid[q] = {}
        }
        if(!layout.grid[q][r]) {
          layout.grid[q][r] = utils.defaultTile()
        }
      }
    }
  },

  tilesMatch(a, b) {
    a = a || {}
    b = b || {}
    for(var prop of utils.FILL_PROPS) {
      if ((a[prop] || null) !== (b[prop] || null)) {
        return false
      }
    }
    return true
  },

  constants: {
    TILE: {
      color: '#FFF',
      fog: false,
      icon: null
    }
  }

}

export default utils
