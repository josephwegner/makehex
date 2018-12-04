<template>
  <div class="pane">
    <div class="pane-header">Hex Viewer</div>
    <div class="pane-content" v-if="this.hex">
      <div id="entities" v-if="editMode && this.hex">
        <div class="form-group">
          <label>Northwest</label>
          <select v-model="nw">
            <option v-bind:value="null">None</option>
            <option v-for="(value, key) in options" v-bind:value="key">{{value}}</option>
          </select>
      </div>
        <div class="form-group">
          <label>Northeast</label>
          <select v-model="ne">
            <option v-bind:value="null">None</option>
            <option v-for="(value, key) in options" v-bind:value="key">{{value}}</option>
          </select>
        </div>
        <div class="form-group">
          <label>East</label>
          <select v-model="e">
            <option v-bind:value="null">None</option>
            <option v-for="(value, key) in options" v-bind:value="key">{{value}}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Southeast</label>
          <select v-model="se">
            <option v-bind:value="null">None</option>
            <option v-for="(value, key) in options" v-bind:value="key">{{value}}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Southwest</label>
          <select v-model="sw">
            <option v-bind:value="null">None</option>
            <option v-for="(value, key) in options" v-bind:value="key">{{value}}</option>
          </select>
        </div>
        <div class="form-group">
          <label>West</label>
          <select v-model="w">
            <option v-bind:value="null">None</option>
            <option v-for="(value, key) in options" v-bind:value="key">{{value}}</option>
          </select>
        </div>
      </div>
      <div id="preview">
        <svg xmlns="http://www.w3.org/2000/svg"
             version="1.1"
             xmlns:xlink="http://www.w3.org/1999/xlink"
             viewBox="0 0 39 46">

          <tile v-if="hex"
            v-bind="hex"
            v-bind:index="1"
            v-bind:gridWidth="1"
            v-bind:viewOnly="true"
            v-bind:xOffset="-17"
            v-bind:yOffset="-30" />

          </svg>
        </div>
    </div>
  </div>
</template>

<script>
import Tile from '../tile.vue'

export default {
  computed: {
    hex() {
      var layout = this.$store.getters.activeLayout
      var hex;
      if (this.editMode) {
        hex = this.$store.state.selectedHex
      } else {
        hex = this.$store.state.hoveredHex
      }

      if (!hex) { return null }

      var index = (layout.width * hex.r) + Math.floor(hex.r / 2) + hex.q

      return layout.grid[index]
    },

    editMode() {
      return this.$store.state.tool.type === 'hex'
    },

    nw: {
      get () {
        var entities = this.hex.entities || {}
        return entities.nw || null
      },
      set (value) {
        this.$store.dispatch('addEntity', {
          nw: value
        })
      }
    },

    ne: {
      get () {
        var entities = this.hex.entities || {}
        return entities.ne || null
      },
      set (value) {
        this.$store.dispatch('addEntity', {
          ne: value
        })
      }
    },

    e: {
      get () {
        var entities = this.hex.entities || {}
        return entities.e || null
      },
      set (value) {
        this.$store.dispatch('addEntity', {
          e: value
        })
      }
    },

    se: {
      get () {
        var entities = this.hex.entities || {}
        return entities.se || null
      },
      set (value) {
        this.$store.dispatch('addEntity', {
          se: value
        })
      }
    },

    sw: {
      get () {
        var entities = this.hex.entities || {}
        return entities.sw || null
      },
      set (value) {
        this.$store.dispatch('addEntity', {
          sw: value
        })
      }
    },

    w: {
      get () {
        var entities = this.hex.entities || {}
        return entities.w || null
      },
      set (value) {
        this.$store.dispatch('addEntity', {
          w: value
        })
      }
    }
  },

  components: {
    Tile
  },

  data () {
    var data = {
      options: {
        door: 'Door'
      }
    }

    return data
  }
}

</script>

<style scoped>
  .pane {
    min-width: 12rem;
  }

  .pane-content {
    text-align: center;
    display: flex;
  }

  #preview {
    display: flex;
    margin: auto;
  }

  #entities {
    padding-left: 1rem;
    display: flex;
    flex-wrap: wrap;
    width: 11em;
  }

  .form-group {
    text-align: left;
    width: 50%;
  }

  .form-group label {
    display: inline-block;
    padding-right: .5rem;
  }

  svg {
    width: 8rem;
    display: inline;
  }
</style>
