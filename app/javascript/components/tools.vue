<template>
  <div class="footer-tools">
    <toolbox v-bind:options="typeOptions"
       v-bind:selected="type"
       v-bind:onUpdate="updateTool.bind(this, 'type')" />

    <toolbox v-bind:options="coverageOptions"
             v-bind:selected="coverage"
             v-bind:onUpdate="updateTool.bind(this, 'coverage')" />

    <div class="color-picker">
      <input type="color" v-model="color" />
    </div>

    <icon-picker v-bind:selected="icon"
                 v-bind:onUpdate="updateTool.bind(this, 'icon')" />
  </div>
</template>

<script>
import Toolbox from './toolbox.vue'
import IconPicker from './icon-picker.vue'

export default {
  data: function () {
    return {
      coverageOptions: {
        single: 'Single',
        fill: 'Fill',
        erase: 'Erase'
      },
      typeOptions: {
        design: 'Design',
        fog: 'Fog of War'
      }
    }
  },

  computed: {
    coverage () {
      return this.$store.state.tool.coverage
    },
    type () {
      return this.$store.state.tool.type
    },
    icon () {
      return this.$store.state.tool.icon
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
    Toolbox,
    IconPicker
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
    padding: 8px;
    box-sizing: border-box;
  }

  .color-picker {
    height: 100%;
    width: var(--toolWidth);
    padding: 0;
    box-sizing: border-box;
    cursor: pointer;
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
