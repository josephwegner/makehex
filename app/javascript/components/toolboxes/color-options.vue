<template>
  <div class="color-options">
    <i v-for="color in layoutColors"
       class="option font-mh hex"
       v-bind:style="{ color: color }"
       v-on:click="set(color)">

         <i v-if="color === currentColor" class="fas fa-check"></i>
    </i>
  </div>
</template>

<script>

export default {

  computed: {
    layoutColors() {
      return this.$store.getters.activeColors
    },

    currentColor() {
      return this.$store.state.drawTools.color
    }
  },

  methods: {
    set(val) {
      this.$store.commit('updateDrawTool', { color: val })
    }
  },

  props: ['close']
}

</script>

<style scoped>
  .color-options {
    display: flex;
  }

  .option {
    height: 2rem;
    width: 2rem;
    margin: .5rem;
    border-radius: var(--borderRadius);
    cursor: pointer;
    font-size: 2rem;
    position: relative;
  }

  i.fas {
    display: block;
    height: 100%;
    width: 100%;
    color: var(--white);
    text-shadow: 0 0 2px var(--gray-9);
    line-height: 2rem;
    text-align: center;
    font-size: 1rem;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
