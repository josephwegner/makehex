<template>
  <div v-bind:class="{ 'draw-option': true, enabled: enabled }"
       v-on:click="toggleEnabled()">
    <div class="slot">
      <slot></slot>
    </div>

    <button v-if="enabled && openOptions"
            class="configure fas fa-cog"
            v-on:click.stop="openOptions()">
    </button>

    <button v-if="toggle && enabled"
            v-bind:class="{toggle: true, on: value}"
            v-on:click.stop="clickToggle()"></button>
  </div>
</template>

<script>

export default {
  beforeUpdate() {
    if (this.forceEnabled && !this.enabled) {
      this.enabled = true
    }
  },

  data() {
    return {
      enabled: this.forceEnabled
    }
  },

  methods: {
    clickToggle() {
      var update = {}
      update[this.option] = !this.value
      this.$store.commit('updateDrawTool', update)
    },

    toggleEnabled() {
      this.enabled = !this.enabled
      if (this.enabled) {
        var update = {}
        update[this.option] = this.toggle ? !this.value : this.value
        this.$store.commit('updateDrawTool', update)
      } else {
        this.$store.commit('removeDrawTool', this.option)
      }
    }
  },

  props: {
    forceEnabled: {
      default: false
    },

    openOptions: {
      default: null
    },

    option: {
      required: true
    },

    toggle: {
      default: false
    },

    value: {
      default: ''
    }
  }
}

</script>

<style scoped>
  .draw-option {
    text-align: center;
    cursor: pointer;
    transition: background-color .125s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .draw-option:hover {
    background-color: var(--lightestBlue);
  }

  .slot {
    padding: 0 .5rem;
  }

  span {
    text-align: center;
    display: block;
    color: var(--gray-2);
    padding-top: .25rem;
    transition: color .125s;
    font-size: 1rem;
  }

  .draw-option:hover span, .draw-option:hover i {
    color: var(--gray-3);
  }

  i {
    font-size: 1.5rem;
    color: var(--gray-2);
    transition: color .125s;
    padding: .5rem 1rem 0 1rem;
    display: block;
    position: relative;
  }

  .preview-icon {
    position: absolute;
    top: 10%;
    left: 0;
    width: 100%;
    height: 100%;
    stroke: black;
    padding: .25em;
    box-sizing: border-box;
    stroke: var(--blue);
  }

  .enabled span, .enabled i, .draw-option.enabled:hover span, .draw-option.enabled:hover i {
    color: var(--blue);
  }

  button {
    background-color: transparent;
    border: none;
    color: var(--lightestBlue);
    padding: .25rem 0;
    transition: background .125s;
    cursor: pointer;
  }

  button.toggle {
    position: relative;
  }

  button.toggle:before {
    content: '';
    display: block;
    height: .5rem;
    width: 1.5rem;
    border: 2px solid;
    border-color: var(--lightestBlue);
    border-radius: 1rem;
    margin: auto;
    transition: border-color .125s;
  }

  button.toggle:after {
    content: '';
    display: block;
    height: .3rem;
    width: .3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 1rem;
    background-color: var(--lightestBlue);
    transform: translate(-.5rem, -.125rem);
    transition: background-color .125s, transform .125s;
  }

  button.toggle.on:after {
    transform: translate(.275rem, -.125rem);
  }

  button.toggle:hover:before {
    border-color: var(--blue);
  }

  button.toggle:hover:after {
    background-color: var(--blue);
  }

  button.toggle.on:hover:before {
    border-color: var(--lightestBlue);
  }

  button.toggle.on:hover:after {
    background-color: var(--lightestBlue);
  }

  .draw-option:hover button:before {
    border-color: var(--blue);
  }

  .draw-option:hover button:after {
    background-color: var(--blue);
  }

  .draw-option:hover button {
    color: var(--lightBlue);
  }

  .draw-option:hover button:hover {
    background-color: var(--lightBlue);
    color: var(--lightestBlue);
  }
</style>
