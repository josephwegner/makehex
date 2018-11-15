<template>
  <div class="pane">
    <div class="pane-header">Hex Viewer</div>
    <div class="pane-content">
      <svg xmlns="http://www.w3.org/2000/svg"
           version="1.1"
           xmlns:xlink="http://www.w3.org/1999/xlink"
           v-if="hex">

        <use xlink:href="/packs/tilecons.svg#hex"
             stroke-width="1"
             v-bind:fill="hex.color || '#FFF'">
        </use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    hex() {
      console.log('hex', this.$store.state.hoveredHex)
      if (!this.$store.state.hoveredHex) { return null }
      var layout = this.$store.getters.activeLayout
      var hex = this.$store.state.hoveredHex

      var index = (layout.width * hex.y) + hex.x
      return layout.grid[index]
    }
  }
}

</script>

<style scoped>
  .pane {
    width: 12rem;
  }

  svg {
    width: 100%;
  }
</style>
