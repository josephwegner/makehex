<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       version="1.1"
       xmlns:xlink="http://www.w3.org/1999/xlink"
       v-bind:width="(width + 2) * 35"
       v-bind:height="(height + 3) * 31">

    <g id="top-add" data-addDir="Top">
      <tile v-for="n in (addWidth)"
            v-bind:key="key(`top-${n}`)"
            v-bind="addHex"
            v-bind:selectable="false"
            v-bind:r="0"
            v-bind:q="n - 1"
            v-bind:gridWidth="width"
            v-bind:xOffset="39 - 4"
            v-on:click="addRows"
            v-bind:viewOnly="true" />
        <tile v-for="n in (addWidth)"
              v-bind:key="key(`2top-${n}`)"
              v-bind="addHex"
              v-bind:selectable="false"
              v-bind:r="1"
              v-bind:q="n - 1"
              v-bind:gridWidth="width"
              v-bind:xOffset="39 - 4"
              v-on:click="addRows"
              v-bind:viewOnly="true" />
    </g>
    <g id="left-add" data-addDir="Left">
      <tile v-for="n in addHeight"
            v-bind:key="key(`left-${n}`)"
            v-bind="addHex"
            v-bind:selectable="false"
            v-bind:r="n"
            v-bind:q="Math.floor((n-1) / -2)"
            v-bind:yOffset="60"
            v-on:click="addRows"
            v-bind:viewOnly="true" />
    </g>
    <g id="right-add" data-addDir="Right">
      <tile v-for="n in addHeight"
            v-bind:key="key(`right-${n}`)"
            v-bind="addHex"
            v-bind:selectable="false"
            v-bind:r="n"
            v-bind:q="width + (Math.floor((n-1) / -2))"
            v-bind:yOffset="60"
            v-bind:xOffset="35"
            v-on:click="addRows"
            v-bind:viewOnly="true" />
    </g>
    <g id="bottom-add" data-addDir="Bottom">
      <tile v-for="n in (addWidth + 1)"
            v-bind:key="key(`bottom-${n}`)"
            v-bind="addHex"
            v-bind:selectable="false"
            v-bind:r="height + 2"
            v-bind:q="Math.floor(height / -2) + n - 2"
            v-bind:gridWidth="width"
            v-bind:xOffset="39 - 4"
            v-on:click="addRows"
            v-bind:viewOnly="true" />
    </g>
    <g id="map-tiles"
       v-on:mousedown="dragging = true"
       v-on:mouseup="dragging = false"
       v-on:mouseleave="onMouseLeave">
       <g v-for="(cells, q) in grid">
        <tile v-for="(tile, r) in cells"
              v-if="r !== selectedHex.r || q !== selectedHex.q"
              v-bind:key="key(q, r)"
              v-bind="tile"
              v-bind:q="parseInt(q)"
              v-bind:r="parseInt(r)"
              v-bind:gridWidth="width"
              v-bind:yOffset="60"
              v-bind:xOffset="35"
              v-on:fill="fillFromCoords"
              v-bind:dragging="dragging" />
      </g>
      <tile v-if="selectedHex.q >= 0"
            v-bind:key="key(selectedHex.q, selectedHex.r)"
            v-bind="grid[selectedHex.q][selectedHex.r]"
            v-bind:q="parseInt(selectedHex.q)"
            v-bind:r="parseInt(selectedHex.r)"
            v-bind:gridWidth="width"
            v-bind:yOffset="60"
            v-bind:xOffset="35"
            v-on:fill="fillFromCoords"
            v-bind:dragging="dragging" />
    </g>
  </svg>
</template>

<script>
import Cable from '../lib/cable.js'
import Tile from './tile.vue'
import GridEvents from '../lib/grid-events.js'
import utils from '../lib/utils.js'

export default {
  components: {
    Tile
  },

  computed: {
    addWidth () {
      if (!this.$store.getters.activeLayout) { return 0 }
      return this.$store.getters.activeLayout.width - 1
    },

    addHeight () {
      if (!this.$store.getters.activeLayout) { return 0 }
      return this.$store.getters.activeLayout.height - 1
    },

    grid () {
      if (!this.$store.getters.activeLayout) { return [] }
      return this.$store.getters.activeLayout.grid
    },

    height () {
      if (!this.$store.getters.activeLayout) { return 0 }
      return this.$store.getters.activeLayout.height
    },

    width () {
      if (!this.$store.getters.activeLayout) { return 0 }
      return this.$store.getters.activeLayout.width
    },

    selectedHex () {
      return this.$store.state.selectedHex ? this.$store.state.selectedHex : {q: -1, r: -1}
    }
  },

  data () {
    var data = {
      fillSections: [],
      dragging: false
    }
    data.addHex = {
      color: '#505050',
      stroke: '#333'
    }

    return data
  },

  methods: {
    addRows (index, e) {
      var dir = e.target.parentElement.parentElement.dataset.addDir
      this.$store.commit(`add${dir}`)
    },

    cubeCoords(index) {
      var width = this.$store.getters.activeLayout.width
      var coords = {
        r: Math.floor(index  / width)
      }
      var qOffset = Math.ceil(coords.r / -2)
      coords.q = (index % width) + qOffset
      coords.s = (coords.q + coords.r) * -1

      return coords
    },

    computeFillSections (changeGrid) {
      if (!changeGrid) {
        changeGrid = {}
      }

      var coordsToCheck = []
      var changes = []
      for (var q in changeGrid) {
        for (var r in changeGrid[q]) {
          changes.push(changeGrid[q][r])
        }
      }

      if(this.fillSections.length) {
        // Pull out any fillSections that might have been effected by the changes
        while(this.fillSections.length && changes.length) {
          var oldHex = changes.shift()
          var newHex = this.grid[oldHex.q][oldHex.r]

          for(var i=0; i<this.fillSections.length; i++) {
            var section = this.fillSections[i]
            //Check old hex for a match
            if(utils.tilesMatch(oldHex, section) || utils.tilesMatch(newHex, section)) {
              var hasNeighbor = section.locations.some((coord) => {
                var hex = {
                  q: coord[0],
                  r: coord[1]
                }
                return (hex.q === oldHex.q && hex.r === oldHex.r) ||
                       this.tilesNeighbors(hex, oldHex)
              })

              if(hasNeighbor) {
                coordsToCheck = coordsToCheck.concat(section.locations)
                this.fillSections.splice(i, 1)
                i--
              }
            }
          }
        }
      } else {
        for (var q in this.grid) {
          coordsToCheck = coordsToCheck.concat(Object.keys(this.grid[q]).map(r => {
            return [q, r]
          }))
        }
      }

      var tilesToCheck = {}
      for (var coords of coordsToCheck) {
        var q = coords[0]
        var r = coords[1]
        if (!tilesToCheck[q]) {
          tilesToCheck[q] = {}
        }
        tilesToCheck[q][r] = Object.assign({},
          this.grid[q][r] || {},
          {q: parseInt(q), r: parseInt(r)}
        )
      }

      var sections = []
      var qs
      while((qs = Object.keys(tilesToCheck)).length) {
        var section = {
          locations: []
        }

        var initialQ = parseInt(qs.shift())
        var initialR = parseInt(Object.keys(tilesToCheck[initialQ]).shift())
        var initialTile = tilesToCheck[initialQ][initialR]

        delete tilesToCheck[initialTile.q][initialTile.r]
        if (Object.keys(tilesToCheck[initialTile.q]).length === 0) {
          delete tilesToCheck[initialTile.q]
        }

        for(var prop of utils.FILL_PROPS) {
          section[prop] = initialTile[prop]
        }

        var queue = [initialTile]
        while(queue.length) {
          var curHex = queue.shift()

          section.locations.push([curHex.q, curHex.r])

          var neighbors = []
          neighbors.push((tilesToCheck[curHex.q] || {})[curHex.r + 1])
          neighbors.push((tilesToCheck[curHex.q] || {})[curHex.r - 1])
          if (tilesToCheck[curHex.q - 1]) {
            neighbors.push((tilesToCheck[curHex.q - 1] || {})[curHex.r])
            neighbors.push((tilesToCheck[curHex.q - 1] || {})[curHex.r + 1])
          }
          if (tilesToCheck[curHex.q + 1]) {
            neighbors.push((tilesToCheck[curHex.q + 1] || {})[curHex.r])
            neighbors.push((tilesToCheck[curHex.q + 1] || {})[curHex.r - 1])
          }

          neighbors.forEach(neighbor => {
            if(neighbor !== undefined && utils.tilesMatch(this.grid[curHex.q][curHex.r], this.grid[neighbor.q][neighbor.r])) {
              queue.push(neighbor)
              delete tilesToCheck[neighbor.q][neighbor.r]
              if (Object.keys(tilesToCheck[neighbor.q]).length === 0) {
                delete tilesToCheck[neighbor.q]
              }
            }
          })
        }

        sections.push(section)
      }

      this.fillSections = this.fillSections.concat(sections)
    },

    fillFromCoords(coords) {
      var tile = this.grid[coords.q][coords.r]

      var locations = this.fillSections.find(section => {
        if (!utils.tilesMatch(section, tile)) { return false }
        return section.locations.some(locCoord => {
          return locCoord[0] === coords.q && locCoord[1] === coords.r
        })
      }).locations

      var tool = this.$store.state.tool

      var features = {}
      switch(tool.type) {
        case 'design':
          if (tool.color) { features.color = tool.color }
          if (tool.icon) { features.icon = tool.icon }
          break

        case 'fog':
          features.fog = this.$store.state.tool.fogType === 'fog' ? true : false
          break
      }

      var updates = {}
      var coordHashes = []
      locations.forEach(coord => {
        var q = coord[0]
        var r = coord[1]
        if (updates[q] === undefined) {
          updates[q] = {}
        }

        coordHashes.push({q: q, r: r})
        updates[q][r] = Object.assign({}, this.grid[q][r], features)
      })

      this.$store.commit('updateTile', { tiles: updates, source: 'fill' })
      Cable.sendTileUpdate(coordHashes)
    },

    key () {
      var joined = Array.prototype.join.call(arguments, '-')
      var id = this.$store.getters.activeLayout ? this.$store.getters.activeLayout.id : 'nolayout'
      return `${id}-${joined}`
    },

    tilesNeighbors(a, b) {
      var distance = Math.max(
        Math.abs(a.q - b.q),
        Math.abs(a.r - b.r),
      )

      return distance === 1
    },

    onMouseLeave() {
      this.dragging = false
      this.$store.commit('hoverHex', null)
    }
  },

  mounted: function() {
    GridEvents.on('tileChange', (changed) => {
      if (this.$store.state.tool.coverage === 'fill') {
        setTimeout(this.computeFillSections.bind(this, changed), 0)
      }
    })

    this.$store.watch(function(state) {
      return state.tool.coverage === 'fill'
    }, () => {
      if(this.$store.state.tool.coverage === 'fill') {
        this.fillSections = []
        this.computeFillSections()
      }
    })
  }
}
</script>

<style scoped>
</style>
