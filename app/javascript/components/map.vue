<template>
  <div id="hex-holder">
    <grid />
  </div>
</template>

<script>
import Grid from './grid.vue'

export default {
  components: {
    Grid
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
    overflow: scroll;
  }
</style>

<style>
  #hex-holder > svg {
    z-index: 2;
  }
</style>
