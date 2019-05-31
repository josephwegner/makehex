<template>
  <div class="color-picker">
    <div v-if="open" class="toolbar-modal">
      <div class="color-tab"
           v-for="color in layoutColors"
           v-bind:style="{ backgroundColor: color }"
           v-on:click="select(color)"
           v-bind:class="{ selected: color === selected } ">
      </div>

      <input type="color"
             class="color-select"
             v-on:input="select($event.target.value)" />
    </div>

    <div class="color-tab selected-color"
         v-bind:style="{ backgroundColor: selected }"
         v-on:click="$emit('click')" >
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    layoutColors() {
      return this.$store.getters.activeColors
    }
  },

  methods: {
    select(color) {
      this.onUpdate(color)
    }
  },

  props: ['open', 'selected', 'onUpdate']
}

</script>

<style scoped>
  .color-picker {
    position: relative;
  }

  .color-tab {
    height: 32px;
    width: 32px;
    margin: 6px;
    border-radius: var(--borderRadius);
    cursor: pointer;
    box-sizing: border-box;
    border: 2px solid var(--darkGray);
  }

  .color-tab.selected-color {
    margin: 0;
  }

  .toolbar-modal {
    width: 11rem;
    padding: 6px;
    display: flex;
    flex-wrap: wrap;
  }

  .color-select {
    background: linear-gradient(90deg, var(--lightRed), var(--lightBlue), var(--lightGreen));
    height: 0;
    width: 0;
    padding: 15px;
    margin: 6px;
    cursor: pointer;
    border-radius: var(--borderRadius);
  }

  ::-webkit-color-swatch {
      border: none;
  }

  ::-webkit-color-swatch-wrapper {
      padding: 0;
  }

  ::-moz-color-swatch,
  ::-moz-focus-inner {
      border: none;
  }

  ::-moz-focus-inner {
      padding: 0;
  }
</style>
