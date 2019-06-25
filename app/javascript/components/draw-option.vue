<template>
  <div v-bind:class="{ 'draw-option': true, enabled: enabled }"
       v-on:click="toggle()">
    <div class="slot">
      <slot></slot>
    </div>
    <button v-if="enabled && openOptions"
            class="configure fas fa-cog"
            v-on:click.stop="openOptions()">
    </button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      enabled: false
    }
  },

  methods: {
    toggle() {
      this.enabled = !this.enabled
      if (this.enabled) {
        var update = {}
        update[this.option] = this.value
        this.$store.commit('updateDrawTool', update)
      } else {
        this.$store.commit('removeDrawTool', this.option)
      }
    }
  },

  props: {
    openOptions: {
      type: Function,
      default: null
    },

    option: {
      type: String,
      required: true
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
  }

  .enabled span, .enabled i, .draw-option.enabled:hover span, .draw-option.enabled:hover i {
    color: var(--blue);
  }

  .configure {
    background: transparent;
    border: none;
    color: var(--lightestBlue);
    padding: .25rem 0;
    transition: background .125s;
    cursor: pointer;
  }

  .draw-option:hover .configure {
    color: var(--lightBlue);
  }

  .draw-option:hover .configure:hover {
    background: var(--lightBlue);
    color: var(--lightestBlue);
  }
</style>
