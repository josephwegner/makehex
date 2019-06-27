<template>
  <div class="footer-tools">
    <div class="toolbar">
      <div class="left-tools">
        <layout-picker />

        <toolbox v-bind:options="typeOptions"
           v-bind:selected="type"
           v-bind:onUpdate="updateTool.bind(this, 'type')" />

        <div class="tool-wrapper" v-if="type === 'design'">
          <toolbox v-bind:options="coverageOptions"
                   v-bind:selected="coverage"
                   v-bind:onUpdate="updateTool.bind(this, 'coverage')" />

          <color-picker v-bind:selected="color"
                        v-bind:onUpdate="updateTool.bind(this, 'color')"
                        v-bind:open="openModal === 'color'"
                        v-on:click="toggleModal('color')"
                        v-on:close="closeModal('color')" />
          <icon-picker v-bind:selected="icon"
                       v-bind:onUpdate="updateTool.bind(this, 'icon')"
                       v-bind:open="openModal === 'icon'"
                       v-on:click="toggleModal('icon')"
                       v-on:close="closeModal('icon')" />
         </div>

         <div class="tool-wrapper" v-if="type === 'fog'">
            <toolbox v-bind:options="coverageOptions"
                     v-bind:selected="coverage"
                     v-bind:onUpdate="updateTool.bind(this, 'coverage')" />

            <toolbox v-bind:options="fogOptions"
                     v-bind:selected="fogType"
                     v-bind:onUpdate="updateTool.bind(this, 'fogType')" />
         </div>

         <div class="tool-wrapper" v-if="type === 'hex'">
           <layout-link />
         </div>
      </div>
      <div class="right-tools">
        <button class="toolbar-button"
                v-on:click="undo()"
                v-bind:style="{ visibility: undoCount ? 'visible' : 'hidden' }">
          <i class="fas fa-undo-alt"></i>
        </button>
        <button class="toolbar-button"
                v-on:click="redo()"
                v-bind:style="{ visibility: redoCount ? 'visible' : 'hidden' }">
          <i class="fas fa-redo-alt"></i>
        </button>
        <button class="toolbar-button" v-on:click="showMetadataModal()">
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </div>
    <Modal />
  </div>
</template>

<script>
import Toolbox from './toolbox.vue'
import HexZoom from './panes/hex-zoom.vue'
import ColorPicker from './color-picker.vue'
import IconPicker from './icon-picker.vue'
import LayoutPicker from './layout-picker.vue'
import LayoutLink from './layout-link.vue'
import Modal from './modal.vue'
import ToolbarPanes from './toolbar-panes.vue'
import GridEvents from '../lib/grid-events.js'

export default {
  data: function () {
    return {
      coverageOptions: {
        single: 'Single',
        fill: 'Fill'
      },
      typeOptions: {
        hex: 'Hex',
        design: 'Design',
        fog: 'Fog of War',
        erase: 'Erase'
      },
      fogOptions: {
        fog: 'Fog',
        nofog: 'No Fog'
      },
      openModal: null
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
    fogType () {
      return this.$store.state.tool.fogType
    },
    color: {
      get () {
        return this.$store.state.tool.color
      },
      set (value) {
        this.updateTool('color', value)
      }
    },
    undoCount () {
      return this.$store.state.undoState.undoCount
    },
    redoCount () {
      return this.$store.state.undoState.redoCount
    }
  },

  components: {
    Toolbox,
    HexZoom,
    ColorPicker,
    IconPicker,
    LayoutPicker,
    LayoutLink,
    Modal,
    ToolbarPanes
  },

  methods: {
    updateTool: function(type, value) {
      this.$store.commit('updateTool', { type, value })
    },

    showMetadataModal: function() {
      this.$store.commit('showModal', 'Metadata')
    },

    undo: function() {
      GridEvents.undo()
    },

    redo: function() {
      GridEvents.redo()
    },

    closeModal(modal) {
      if (this.openModal === modal) {
        this.openModal = null
      }
    },

    toggleModal(modal) {
      if (this.openModal === modal) {
        this.openModal = null
      } else {
        this.openModal = modal
      }
    }
  }
}
</script>

<style scoped>
  .toolbar {
    background-color: var(--gray-4);
    height: var(--toolbarWidth);
    display: flex;
    padding: 8px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
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
  	border: 2px solid var(--gray-9);
    border-radius: var(--borderRadius);
  }
</style>

<style>

.toolbar-button {
  height: 100%;
  width: var(--toolWidth);
  box-sizing: border-box;
  border: 2px solid var(--gray-9);
  border-radius: var(--borderRadius);
  background: var(--gray-7);
  color: var(--gray-1);
  font-size: 18px;
  padding: 0;
  cursor: pointer;
}



.toolbar-modal {
  background-color: var(--gray-7);
  border-radius: var(--borderRadius);
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translateX(-50%) translateY(-1rem);
  box-shadow: 0 0 10px 0 var(--gray-9);
}

.toolbar-modal:after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 7px solid var(--gray-7);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: rotate(90deg) translateX(-50%);
}

</style>
