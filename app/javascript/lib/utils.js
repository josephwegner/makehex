const utils = {
  FILL_PROPS: ['color', 'icon'],

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
