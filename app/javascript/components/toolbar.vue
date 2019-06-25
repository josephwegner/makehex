<template>
  <div class="toolbar">
    <a href="/maps" class="logo"></a>
    <div class="tooling">
      <div class="categories">
        <button v-for="(label, key) in categories"
                v-on:click="selectCategory(key)"
                v-bind:class="{ selected: (category === key)}">

          {{ label }}
        </button>
      </div>
      <toolbox>
        <Drawbox />
      </toolbox>
    </div>
  </div>
</template>

<script>
import Toolbox from './toolbox.vue'
import Drawbox from './toolboxes/drawbox.vue'

export default {
  components: { Toolbox, Drawbox },

  computed: {
    chosenToolbox() {
      return {
        draw: Drawbox,
        layouts: Drawbox,
        settings: Drawbox
      }[this.category]
    }
  },

  data() {
    return {
      category: 'draw',
      categories: {
        draw: 'Draw',
        layouts: 'Layouts',
        settings: 'Settings'
      }
    }
  },

  methods: {
    selectCategory(category) {
      this.category = category
    }
  }
}

</script>

<style scoped>
  .toolbar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background-color: var(--whiteBlue);
    display: flex;
  }

  .logo {
    width: 2rem;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center;
    margin: 0 1rem;
  }

  .tooling {
    flex: auto;
  }

  .categories {
    background-color: var(--blue);
    position: relative;
    z-index: 2;
  }

  .categories button {
    color: var(--lightestBlue);
    background: transparent;
    border: none;
    font-size: .75rem;
    cursor: pointer;
    padding: .5rem 1rem;
    transition: background-color .25s;
  }

  .categories button.selected {
    background-color: var(--lightestBlue);
    color: var(--blue);
    transition: none;
  }

  .categories button:not(.selected):hover {
    background-color: var(--lightBlue);
  }
</style>
