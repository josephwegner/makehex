<template>
  <div id="hex-holder">
  </div>
</template>

<script>
import Grid from '../lib/grid.js'

export default {
  mounted: function () {
    new Grid(this.$el, this.$store)
  }
}

function hexClick(component, index) {
  this.fill('green')
}
</script>

<style scoped>
  #hex-holder {
    height: 100%;
    width: 100%;
  }
</style>
