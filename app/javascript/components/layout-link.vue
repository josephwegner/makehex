<template>
  <div class="layout-link" v-if="selectedHex">
    <div v-if="open" class="toolbar-modal">
      <ul>
        <li v-for="layout in layouts"
            v-on:click="select(layout.id)"
            v-bind:class="{selected: layout.id === (selectedLayout ? selectedLayout.id : null) }">

          {{ layout.name }}
        </li>
        <li v-on:click="select(null)"
            v-bind:class="{selected: selectedLayout === null }">

            Nowhere
        </li>
      </ul>
    </div>


    <button v-on:click="open = !open">
      Link to: {{ selectedLayout ? selectedLayout.name : 'Nowhere' }}
    </button>
  </div>
</template>

<script>
import API from '../lib/api.js'

export default {
  computed: {
    selectedHex () {
      return this.$store.getters.selectedHex
    },

    selectedLayout () {
      if (!this.$store.state.selectedHex) { return null }
      var entities = this.$store.getters.selectedHex.entities || {}
      var inEntities = entities.in ? entities.in : {}

      if (inEntities.link) {
        return this.$store.state.map.layouts.find(layout => {
          return layout.id === inEntities.link
        })
      } else {
        return null
      }
    },

    layouts () {
      if (!this.$store.state.map) { return [] }
      return this.$store.state.map.layouts.map(l => {
        return {
          name: l.name,
          id: l.id
        }
      }).sort((a,b) => {
        if(a>b) {
          return 1
        } else if (a<b) {
          return -1
        }
        return 0
      }).filter(l => {
        return l.id !== this.$store.state.activeLayoutId
      })
    }
  },

  data() {
    var data = {
      open: false
    }
    return data
  },

  methods: {
    select(layout) {
      var entity = {
        in: {
          link: layout
        }
      };

      this.$store.dispatch('addEntity', entity)
      this.open = false
    }
  }
}

</script>

<style scoped>
  .layout-link {
    position: relative;
    white-space: nowrap;
  }

  button {
    height: 100%;
    box-sizing: border-box;
    border: 2px solid var(--darkGray);
    border-radius: var(--borderRadius);
    background: var(--midGray);
    color: var(--darkWhite);
    font-size: .75rem;
    cursor: pointer;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    border: 2px solid var(--darkGray);
    border-radius: var(--borderRadius);
    width: 100%;
    box-sizing: border-box;
  }

  li {
    padding: .5rem;
    transition: background .125s;
    cursor: pointer;
  }

  li:first-child {
    border-top-left-radius: var(--borderRadius);
    border-top-right-radius: var(--borderRadius);
  }

  li:last-child {
    border-bottom-left-radius: var(--borderRadius);
    border-bottom-right-radius: var(--borderRadius);
  }

  li.selected {
    background: var(--darkWhite);
    color: var(--black);
  }

  li:not(.selected):hover {
    background: var(--gray);
  }
</style>
