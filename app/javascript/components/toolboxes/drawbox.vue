<template>
  <div class="drawbox">
    <transition name="drawoptions">
      <div class="drawoptions" v-show="!optionsPage">
        <draw-option option="color"
                     v-bind:openOptions="openOptions.bind(this, 'color-options')"
                     v-bind:value="color">
          <i class="font-mh hexfill" v-bind:style="{ color: fillColor} "></i>
          <span>Color</span>
        </draw-option>
        <draw-option option="icon">
          <i class="font-mh hextexture"></i>
          <span>Texture</span>
        </draw-option>
        <draw-option option="fog">
          <i class="font-mh hexvisibility"></i>
          <span>Fog of War</span>
        </draw-option>
      </div>
    </transition>
    <transition name="optionsPage">
      <div v-if="optionsPage" class="options-wrapper">
        <button class="close-options far fa-times-circle" v-on:click="optionsPage = null"></button>
        <component v-bind:is="optionsPage" v-bind:close="closeOptions" />
      </div>
    </transition>
  </div>
</template>

<script>
import DrawOption from '../draw-option.vue'
import ColorOptions from './color-options.vue'

export default {
  components: { DrawOption, ColorOptions },

  computed: {
    fillColor() {
      return this.$store.state.drawTools.color
    },

    color() {
      if (this.$store.state.drawTools.color) {
        this.defaultColor = this.$store.state.drawTools.color
      } else if (this.defaultColor) {
        return this.defaultColor
      } else if (this.$store.getters.activeColors) {
        this.defaultColor = this.$store.getters.activeColors[0]
      } else {
        this.defaultColor = '#297C46'
      }

      return this.defaultColor
    }
  },

  data() {
    return {
      colorOptions: ColorOptions,
      optionsPage: null,
      defaultColor: null
    }
  },

  methods: {
    closeOptions() {
        this.optionsPage = null
    },

    openOptions(component) {
      this.optionsPage = component
    }
  }
}

</script>

<style scoped>
  .drawbox {
    position: relative;
  }

  .close-options {
    display: block;
    font-size: 1.5rem;
    background: none;
    border: none;
    color: var(--gray-2);
    float: left;
    margin-top: .5rem;
    cursor:pointer;
    transition: color .125s;
  }

  .close-options:hover {
    color: var(--gray-3);
  }

  .drawoptions {
    display: flex;
    height: 100%;
  }

  .drawoptions, .options-wrapper {
    position: relative;
    z-index: 1;
  }

  .drawoptions-enter-active, .drawoptions-leave-active {
    transition: opacity .5s, transform .5s;
  }
  .drawoptions-enter, .drawoptions-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(-100%);
  }

  .optionsPage-enter-active, .optionsPage-leave-active {
    transition: opacity .5s, transform .5s;
    top: -100%;
  }

  .optionsPage-enter, .optionsPage-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(100%);
  }
</style>
