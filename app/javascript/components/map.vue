<template>
  <div id="hex-holder">
    <grid />
    <toast />
  </div>
</template>

<script>
import Grid from './grid.vue'
import Toast from './toast.vue'

export default {
  components: {
    Grid,
    Toast
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
