<template>
  <div class="layout-picker">
    <div v-if="open" class="toolbar-modal">
      <ul>
        <li v-for="layout in layouts"
            v-on:click="select(layout.id)"
            v-bind:class="{selected: layout.id === selectedLayout }">

          {{ layout.name }}
        </li>
      </ul>
      <button class="add-layout-button" v-on:click="addLayoutForm = !addLayoutForm">Add Layout</button>
      <div v-if="addLayoutForm" class="add-layout-form">
        <input type="text" placeholder="Layout Name" v-model="newLayoutName" v-focus />
        <button class="submit-layout" v-on:click="addLayout()">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>


    <button class="toolbar-button" v-on:click="open = !open">
      <i class="far fa-images"></i>
    </button>
  </div>
</template>

<script>
import API from '../lib/api.js'

export default {
  computed: {
    selectedLayout () {
      return this.$store.state.activeLayoutId || null
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
      })
    }
  },

  data() {
    var data = {
      open: false,
      addLayoutForm: false,
      newLayoutName: ''
    }

    return data
  },

  methods: {
    addLayout() {
      if (this.newLayoutName.replace(/ /g, '') === '') { return }
      API.createLayout(this.$store.state.map.id, this.newLayoutName).then(layout => {
        this.$store.commit('addLayout', layout)
        this.newLayoutName = ''
        this.addLayoutForm = false

        this.select(layout.id)
      })
    },

    select(layout) {
      this.$store.commit('openLayout', layout)
      this.open = false
    }
  }
}

</script>

<style scoped>
  .layout-picker {
    height: 100%;
    width: var(--toolWidth);
    box-sizing: border-box;
    padding: 0;
    margin: 0 4px;
    position: relative;
    white-space: nowrap;
  }

  .toolbar-modal {
    left: 0;
    transform: translateY(-1rem);
    padding: .5rem;
  }

  .toolbar-modal:after {
    left: 0;
    transform: translateX(1rem) rotate(90deg) translateX(-50%);
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

  .add-layout-button {
    background-color: var(--blue);
    transition: background-color .125s;
    cursor: pointer;
    width: 100%;
    min-width: 10rem;
    padding: .5rem 0;
    color: var(--white);
    border: none;
    border-radius: var(--borderRadius);
    margin-top: .5rem;
    font-weight: 700;

  }

  .add-layout-button:hover {
    background-color: var(--midBlue);
  }

  .add-layout-form {
    position: relative;
  }

  input {
    background: var(--midGray);
    border: 2px solid var(--darkGray);
    border-radius: var(--borderRadius);
    font-size: 1rem;
    padding: .5rem;
    margin-top: .5rem;
  }

  .submit-layout {
    background-color: var(--green);
    transition: background-color .125s;
    border: none;
    border-radius: var(--borderRadius);
    height: 1.5rem;
    width: 1.5rem;
    position: absolute;
    right: .5rem;
    top: 1rem;
    cursor: pointer;
  }

  .submit-layout:hover {
    background-color: var(--midGreen);
  }
</style>
