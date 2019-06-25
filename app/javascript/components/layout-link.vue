<template>
  <div class="layout-link" v-if="selectedHex">
    <div v-if="open" class="toolbar-modal">
      <ul>
        <li v-for="layout in layouts"
            v-on:click="select(layout.id, selectedLink.locked)"
            v-bind:class="{selected: layout.id === (selectedLink.layout ? selectedLink.layout : null) }">

          {{ layout.name }}
        </li>
        <li v-on:click="select(null, selectedLink.locked)"
            v-bind:class="{selected: selectedLink.layout === null }">

            Nowhere
        </li>
      </ul>
    </div>


    <button v-on:click="open = !open">
      Link to: {{ selectedLink.layout ? layoutById(selectedLink.layout).name : 'Nowhere' }}
    </button>
    <div class="lock" v-if="selectedLink.layout">
      <input type="checkbox"
             v-bind:checked="selectedLink.locked"
             v-on:change="select(selectedLink.layout, $event.target.checked)" />
      <label>Lock for players</label>
    </div>
  </div>
</template>

<script>
import API from '../lib/api.js'

export default {
  computed: {
    selectedHex () {
      return this.$store.getters.selectedHex
    },

    selectedLink () {
      if (!this.$store.state.selectedHex) { return null }
      var entities = this.$store.getters.selectedHex.entities || {}
      var inEntities = entities.in ? entities.in : {}

      if (!inEntities.link) {
        inEntities.link = {
          layout: null,
          locked: false
        }
      }

      // This is a legacy hack from an old link data model. Deprecated 6/13/19. Should be removed eventually.
      if (typeof(inEntities.link) === 'number') {
        return {
          layout: inEntities.link,
          locked: false
        }
      } else {
        return inEntities.link
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
    select(layout, locked) {
      var entity = {
        in: {
          link: {
            layout: layout,
            locked: locked
          }
        }
      };

      this.$store.dispatch('addEntity', entity)
      this.open = false
    },

    layoutById(id) {
      return this.layouts.find(layout => {
        return layout.id === id
      })
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
    border: 2px solid var(--gray-9);
    border-radius: var(--borderRadius);
    background: var(--gray-7);
    color: var(--gray-1);
    font-size: .75rem;
    cursor: pointer;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    border: 2px solid var(--gray-9);
    border-radius: var(--borderRadius);
    width: 100%;
    box-sizing: border-box;
  }

  li {
    padding: .5rem;
    transition: background .125s;
    cursor: pointer;
    color: var(--white);
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
    background: var(--gray-1);
    color: var(--black);
  }

  li:not(.selected):hover {
    background: var(--gray-8);
  }

  label {
    color: var(--gray-1);
    font-size: .75rem;
  }

  .lock {
    display: inline-block;
  }
</style>
