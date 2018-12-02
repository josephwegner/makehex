<template>
  <div class="pane">
    <div class="pane-header">Hex Viewer</div>
    <div class="pane-content">
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
</template>

<script>
import Tile from '../tile.vue'

export default {
  computed: {
    hex() {
      var layout = this.$store.getters.activeLayout
      var hex;
      if (this.$store.state.tool.type === 'hex') {
        hex = this.$store.state.selectedHex
      } else {
        hex = this.$store.state.hoveredHex
      }

      if (!hex) { return null }

      var index = (layout.width * hex.r) + Math.floor(hex.r / 2) + hex.q

      return layout.grid[index]
    }
  },

  components: {
    Tile
  }
}

</script>

<style scoped>
  .pane {
    width: 12rem;
  }

  .pane-content {
    text-align: center;
  }

  svg {
    width: 8rem;
    display: inline;
  }
</style>
