<template>
  <div class="color-options">
    <div v-for="color in layoutColors"
         class="option"
         v-bind:style="{ backgroundColor: color }"
         v-on:click="set(color)">

         <i v-if="color === currentColor" class="fas fa-check"></i>
    </div>
  </div>
</template>

<script>

export default {
  mounted() {
      console.log(this.value)
  },

  computed: {
    layoutColors() {
      return this.$store.getters.activeColors
    },

    currentColor() {
      console.log(this.$store.state.drawTools.color)
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
  }

  i {
    display: block;
    height: 100%;
    width: 100%;
    color: var(--white);
    text-shadow: 0 0 2px var(--gray-9);
    line-height: 2rem;
    text-align: center;
  }
</style>
