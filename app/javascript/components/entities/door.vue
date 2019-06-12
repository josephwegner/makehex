<template>
  <g v-bind:style="{ transform: coords.transform }">
    <line v-bind:x1="coords.x1"
          v-bind:y1="coords.y1"
          v-bind:x2="coords.x2"
          v-bind:y2="coords.y2"
          stroke-width="1.2" />
    <line v-bind:x1="coords.x1"
          v-bind:y1="coords.y1"
          v-bind:x2="coords.x1 + 5"
          v-bind:y2="coords.y1 - 7"
          v-bind:stroke="color"
          stroke-width="2" />
  </g>
</template>

<script>
export default {
  computed: {
    coords() {
      var baseX
      var baseY
      var transform

      switch (this.dir) {
        case 'nw':
          baseX = -25
          baseY = -34.38
          transform = 'rotate(150deg)'
          break

        case 'ne':
          baseX = -47.5
          baseY = -15.1
          transform = 'rotate(210deg)'
          break

        case 'e':
          baseX = -41.5
          baseY = 13.5
          transform = 'rotate(270deg)'
          break

        case 'se':
          baseX = -13.5
          baseY = 23
          transform = 'rotate(330deg)'
          break

        case 'sw':
          baseX = 8.5
          baseY = 3.5
          transform = 'rotate(30deg)'
          break

        case 'w':
          baseX = 2.5
          baseY = -25
          transform = 'rotate(90deg)'
          break
      }

      return {
        x1: baseX+13.5 ,
        y1: baseY+23,
        x2: baseX+25.38 ,
        y2: baseY+23,
        transform: transform
      }
    }
  },

  props: ['color', 'dir', 'fill']
}
</script>

<style scoped>

</style>
