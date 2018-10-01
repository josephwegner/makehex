<template>
  <div class="footer-tools">
    <toolbox v-bind:options="typeOptions"
             v-bind:selected="type"
             v-bind:onUpdate="updateTool.bind(this, 'type')" />

    <div class="color-picker">
      <input type="color" v-model="color" />
    </div>
  </div>
</template>

<script>
import Toolbox from './toolbox.vue'

export default {
  data: function () {
    return {
      typeOptions: {
        single: 'Single',
        fill: 'Fill',
        erase: 'Erase'
      }
    }
  },

  computed: {
    type () {
      return this.$store.state.tool.type
    },
    color: {
      get () {
        return this.$store.state.tool.color
      },
      set (value) {
        this.updateTool('color', value)
      }
    }
  },

  components: {
    Toolbox
  },

  methods: {
    updateTool: function(type, value) {
      this.$store.commit('updateTool', { type, value })
    }
  }
}
</script>

<style scoped>
  .footer-tools {
    background-color: var(--lightGray);
    height: var(--toolbarWidth);
    display: flex;
  }

  .color-picker {
    height: 100%;
    width: var(--toolbarWidth);
    padding: 8px;
    box-sizing: border-box;
  }

  input[type="color"] {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    outline: none;
    border: none;
    background: transparent;
  }
  input[type="color"]::-webkit-color-swatch-wrapper {
	  padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
  	border: 2px solid var(--darkGray);
    border-radius: var(--borderRadius);
  }
</style>
