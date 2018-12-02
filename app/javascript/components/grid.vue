<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       version="1.1"
       xmlns:xlink="http://www.w3.org/1999/xlink"
       v-bind:width="(width + 2) * 35"
       v-bind:height="(height + 3) * 31">

    <g id="top-add">
      <tile v-for="n in (addWidth * 2)"
            v-bind:key="key(`top-${n}`)"
            v-bind="addHex"
            v-bind:selectable="false"
            v-bind:index="n"
            v-bind:gridWidth="width"
            v-bind:xOffset="39 - 4"
            v-on:click="addRows.bind(this, 'Top')" />
    </g>
    <g id="left-add">
      <tile v-for="n in addHeight"
            v-bind:key="key(`left-${n}`)"
            v-bind="addHex"
            v-bind:selectable="false"
            v-bind:index="n"
            v-bind:yOffset="60"
            v-on:click="addRows.bind(this, 'Left')" />
    </g>
    <g id="right-add">
      <tile v-for="n in addHeight"
            v-bind:key="key(`right-${n}`)"
            v-bind="addHex"
            v-bind:selectable="false"
            v-bind:index="n"
            v-bind:yOffset="60"
            v-bind:xOffset="(34 * (width + 1)) + 2"
            v-on:click="addRows.bind(this, 'Right')" />
    </g>
    <g id="bottom-add">
      <tile v-for="n in addWidth"
            v-bind:key="key(`bottom-${n}`)"
            v-bind="addHex"
            v-bind:selectable="false"
            v-bind:index="n"
            v-bind:gridWidth="width"
            v-bind:xOffset="height % 2 ? 17 : 35"
            v-bind:yOffset="(30 * (height + 2))"
            v-on:click="addRows.bind(this, 'Bottom')" />
    </g>
    <g id="map-tiles"
       v-on:mousedown="dragging = true"
       v-on:mouseup="dragging = false"
       v-on:mouseleave="dragging = false">

      <tile v-for="(tile, index) in regularTiles"
            v-bind:key="key(index)"
            v-bind="tile"
            v-bind:index="index"
            v-bind:gridWidth="width"
            v-bind:yOffset="60"
            v-bind:xOffset="35"
            v-on:click="onTileClick"
            v-on:hover="onTileHover" />
      <tile v-if="selectedIndex >= 0"
            v-bind:key="key(selectedIndex)"
            v-bind="grid[selectedIndex]"
            v-bind:index="selectedIndex"
            v-bind:gridWidth="width"
            v-bind:yOffset="31"
            v-bind:xOffset="35"
            v-on:click="onTileClick"
            v-on:hover="onTileHover" />
    </g>
  </svg>
</template>

<script>
import Cable from '../lib/cable.js'
import Tile from './tile.vue'

const FILL_PROPS = ['color', 'icon']

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

    regularTiles () {
      if (!this.selectedIndex) { return this.grid }

      return this.grid.filter((tile, index) => {
        return index !== this.selectedIndex
      })
    },

    selectedIndex () {
      if (!this.$store.state.selectedHex) { return -1 }
      var hex = this.$store.state.selectedHex
      var layout = this.$store.getters.activeLayout

      return (layout.width * hex.r) + Math.floor(hex.r / 2) + hex.q
    },

    width () {
      if (!this.$store.getters.activeLayout) { return 0 }
      return this.$store.getters.activeLayout.width
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
    addRows (dir) {
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

    computeFillSections (changedIndexes) {
      var indexesToCheck = []

      if(this.fillSections.length) {
        // Pull out any fillSections that might have been effected by the changes
        while(this.fillSections.length && changedIndexes.length) {
          var oldHex = changedIndexes.shift()
          var newHex = this.grid[oldHex.index]

          for(var i=0; i<this.fillSections.length; i++) {
            var section = this.fillSections[i]
            //Check old hex for a match
            if(this.tilesMatch(oldHex, section) || this.tilesMatch(newHex, section)) {
              var hasNeighbor = section.locations.some((index) => {
                return this.tilesNeighbors(this.cubeCoords(index), this.cubeCoords(oldHex.index))
              })

              if(hasNeighbor) {
                indexesToCheck = indexesToCheck.concat(section.locations)
                this.fillSections.splice(i, 1)
                i--
              }
            }
          }
        }
      } else {
        indexesToCheck = this.grid.map((t, i) => { return i })
      }

      var tilesToCheck = indexesToCheck.map(index => {
        return Object.assign({},
          this.grid[index] || {},
          this.cubeCoords(index),
          { index: index }
        )
      })

      var sections = []
      while(tilesToCheck.length) {
        var section = {
          locations: []
        }
        var initialTile = tilesToCheck.shift()

        for(var prop of FILL_PROPS) {
          section[prop] = initialTile[prop]
        }

        var queue = [initialTile]
        while(queue.length) {
          var curHex = queue.shift()
          section.locations.push(curHex.index)

          tilesToCheck.forEach((tile, index) => {
            if(!this.tilesMatch(this.grid[curHex.index], this.grid[tile.index])) { return }
            if (this.tilesNeighbors(tile, curHex)) {
              queue.push(tile)
              tilesToCheck.splice(index, 1)
            }
          })
        }

        sections.push(section)
      }

      this.fillSections = this.fillSections.concat(sections)
    },

    fillFromIndex(index) {
      var indexes = this.fillSections.find(section => {
        if (!this.tilesMatch(section, this.grid[index])) { return false }
        return section.locations.indexOf(index) >= 0
      }).locations
      var tool = this.$store.state.tool

      var features = {}
      switch(tool.type) {
        case 'design':
          if (tool.color) { features.color = tool.color }
          if (tool.icon) { features.icon = tool.icon }
          break

        case 'fog':
          features.fog = this.$store.state.tool.coverage === 'erase' ? false : true
          break
      }

      var updates = indexes.map(i => {
        return Object.assign({}, this.grid[i], features, {index: i})
      })

      this.$store.commit('updateTile', updates)
      Cable.sendTileUpdate(updates)
    },

    key (index) {
      return `${this.$store.getters.activeLayout.id}-${index}`
    },

    onTileClick(index) {
    },

    onTileHover(index, $event) {
    },

    tilesMatch(a, b) {
      a = a || {}
      b = b || {}
      for(var prop of FILL_PROPS) {
        if (a[prop] !== b[prop]) {
          return false
        }
      }
      return true
    },

    tilesNeighbors(a, b) {
      var distance = Math.max(
        Math.abs(a.q - b.q),
        Math.abs(a.r - b.r),
        Math.abs(a.s - b.s)
      )

      return distance === 1
    }
  },

  mounted: function() {
    this.$store.watch((state, getters) => {
      if (!getters.activeLayout) { return null }
      return getters.activeLayout.grid.map(tile => {
        var obj = {}
        tile = tile || {}
        for(var prop of FILL_PROPS) {
          obj[prop] = tile[prop]
        }
        return obj
      })
    }, (newGrid, oldGrid) => {
      oldGrid = oldGrid || []

      var changed = []
      if(!oldGrid.hasOwnProperty())
      oldGrid.forEach((oldEle, index) => {
        var newEle = newGrid[index]
        if(!this.tilesMatch(oldEle, newEle)) {
          changed.push(Object.assign({}, oldEle, { index: index }))
        }
      })

      //requestIdleCallback(this.computeFillSections.bind(this, changed))
    }, { deep: true })
  }
}
</script>

<style scoped>
</style>
