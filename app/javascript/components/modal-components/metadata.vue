<template>
  <div class="form">
    <h2>Map Info</h2>
    <p class="share-url">
      <span>Share URL:</span>
      <span>{{shareURL}}</span>
    </p>
    <div class="form-group">
      <label for="map-name">Map Name</label>
      <input v-model="mapName" id="map-name" type="text" />
    </div>
    <h2>Layout Info</h2>
    <div class="form-group">
      <label for="layout-name">Layout Name</label>
      <input v-model="layoutName" id="layout-name" type="text" />
    </div>
    <div class="form-group checkbox-group">
      <input type="checkbox" id="default-layout" v-model="isDefaultLayout" />
      <label for="default-layout">Default Layout</label>
    </div>
    <button v-on:click="save()">Save</button>
  </div>
</template>

<script>
import API from '../../lib/api.js'

export default {
  computed: {
    shareURL () {
      return `${window.location.protocol}//${window.location.host}/maps/${this.$store.state.mapCode}`
    },

    mapName: {
      get () {
        return this.$store.state.map ? this.$store.state.map.name : ''
      },
      set (value) {
        this.$store.commit('setMapName', value)
      }
    },

    layoutName: {
      get () {
        return this.$store.getters.activeLayout ? this.$store.getters.activeLayout.name : ''
      },
      set (value) {
        this.$store.commit('setLayoutName', value)
      }
    },

    isDefaultLayout: {
      get () {
        if (this.$store.getters.activeLayout) {
          return this.$store.state.activeLayoutId === this.$store.state.map.default_layout_id
        }
        return false
      },
      set (value) {
        this.$store.commit('setDefaultLayout', this.$store.state.activeLayoutId)
      }
    }
  },

  data: function () {
    var data = {
      originals: {
        mapName: this.$store.state.map ? this.$store.state.map.name : '',
        layoutName: this.$store.getters.activeLayout ? this.$store.getters.activeLayout.name : '',
        defaultLayout: null
      }
    }

    if (this.$store.state.map) {
      data.originals.defaultLayout = this.$store.state.map.default_layout_id
    }

    return data
  },

  methods: {
    prepareToClose () {
      this.$store.commit('setDefaultLayout', this.originals.defaultLayout)
      this.$store.commit('setMapName', this.originals.mapName)
      this.$store.commit('setLayoutName', this.originals.layoutName)
    },

    save () {
      Promise.all([
        API.updateMap(this.$store.state.map.id, {
          name: this.mapName,
          default_layout_id: this.$store.state.map.default_layout_id
        }),
        API.updateLayout(this.$store.state.activeLayoutId, {
          name: this.layoutName
        })
      ]).then((responses) => {
        this.$store.commit('closeModal')
      })
    }
  }
}

</script>

<style scoped>
  h2 {
    text-align: center;
    color: var(--gray-1);
    margin-bottom: 0;
  }

  .share-url {
    text-align: center;
    font-size: .75rem;
    margin: .5rem auto 2rem auto;
  }

  .share-url span:first-child {
    color: var(--gray-1);
    font-weight: 600;
  }

  .share-url span:last-child {
    color: var(--gray-1);
  }

  .form {
    width: 30rem;
    margin: auto;
  }

  button {
    background-color: var(--blue);
    color: var(--white);
    width: 100%;
    border-radius: var(--borderRadius);
    font-size: 1rem;
    padding: .5rem 0;
    margin-top: 2rem;
    cursor: pointer;
    transition: background-color .1s;
    border: none;
  }

  button:hover {
    background-color: var(--lightBlue);
  }
</style>
