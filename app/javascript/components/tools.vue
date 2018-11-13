<template>
  <div class="footer-tools">
    <div class="left-tools">
      <layout-picker />

      <toolbox v-bind:options="typeOptions"
         v-bind:selected="type"
         v-bind:onUpdate="updateTool.bind(this, 'type')" />

      <div class="tool-wrapper" v-if="type === 'design' || type === 'fog' ">
        <toolbox v-bind:options="coverageOptions"
                 v-bind:selected="coverage"
                 v-bind:onUpdate="updateTool.bind(this, 'coverage')" />

        <div class="color-picker">
          <input type="color" v-model="color" />
        </div>

        <icon-picker v-bind:selected="icon"
                     v-bind:onUpdate="updateTool.bind(this, 'icon')" />
       </div>

       <div class="tool-wrapper" v-if="type === 'hex'">
         <layout-link />
       </div>
    </div>
    <div class="right-tools">
      <button class="toolbar-button" v-on:click="showMetadataModal()">
        <i class="fas fa-cog"></i>
      </button>
    </div>

    <Modal />
  </div>
</template>

<script>
import Toolbox from './toolbox.vue'
import IconPicker from './icon-picker.vue'
import LayoutPicker from './layout-picker.vue'
import LayoutLink from './layout-link.vue'
import Modal from './modal.vue'

export default {
  data: function () {
    return {
      coverageOptions: {
        single: 'Single',
        fill: 'Fill',
        erase: 'Erase'
      },
      typeOptions: {
        hex: 'Hex',
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
    IconPicker,
    LayoutPicker,
    LayoutLink,
    Modal
  },

  methods: {
    updateTool: function(type, value) {
      this.$store.commit('updateTool', { type, value })
    },

    showMetadataModal: function() {
      this.$store.commit('showModal', 'Metadata')
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

  .left-tools {
    display: flex;
    flex-grow: 1;
  }

  .tool-wrapper {
    display: flex;
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

<style>

.toolbar-button {
  height: 100%;
  width: var(--toolWidth);
  box-sizing: border-box;
  border: 2px solid var(--darkGray);
  border-radius: var(--borderRadius);
  background: var(--midGray);
  color: var(--darkWhite);
  font-size: 18px;
  padding: 0;
  cursor: pointer;
}



.toolbar-modal {
  background-color: var(--midGray);
  border-radius: var(--borderRadius);
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translateX(-50%) translateY(-1rem);
  box-shadow: 0 0 10px 0 var(--darkGray);
}

.toolbar-modal:after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 7px solid var(--midGray);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: rotate(90deg) translateX(-50%);
}

</style>
