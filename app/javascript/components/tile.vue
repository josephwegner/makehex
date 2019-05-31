<template>
  <g v-bind:transform="translation" v-bind:mask="mask">
    <use href="#hex"
         v-bind:width="width"
         v-bind:height="height"
         v-bind:stroke="selected ? '#999' : stroke"
         v-bind:stroke-width="selected ? 3 : 1"
         v-bind:fill="fog && !isEditor ? '#cdcdcd' : color"
         v-bind:data-q="q"
         v-bind:data-r="r"
         v-on:mouseover="onHover($event)"
         v-on:mousedown="onClick($event)">
    </use>

    <use v-if="icon && !fog"
         v-bind:href="`/packs/tilecons.svg#${icon}`"
         v-bind:height="height"
         v-bind:width="width"></use>

    <use v-if="inEntities.link && !fog"
         href="#arrow-out-right"
         class="clickable-svg"
         height="20"
         width="20"
         x="11.5"
         y="4"
         v-on:click="openLayout(inEntities.link)"></use>


    <component v-for="entity in dirEntities"
               ng-if="entity.entity"
               v-bind:is="entity.entity"
               v-bind:color="color"
               v-bind:dir="entity.dir" />

  </g>
</template>

<script>
import Cable from '../lib/cable.js'
import Door from './entities/door.vue'
import utils from '../lib/utils.js'

const WIDTH = 39
const HEIGHT = 46

export default {
  components: {
    Door
  },

  computed: {
    isEditor() {
      return this.$store.state.editor
    },

    inEntities() {
      return this.entities.in ? this.entities.in : {}
    },

    dirEntities() {
      var entities = []
      for (var dir in this.entities) {
        if (dir === 'in') { continue }

        entities.push({
          dir: dir,
          entity: this.entities[dir]
        })
      }
      return entities
    },

    mask() {
      return this.fog ? 'url(#fog)' : ''
    },

    selected() {
      return this.selectable &&
             this.$store.state.selectedHex &&
             this.$store.state.selectedHex.q === this.q &&
             this.$store.state.selectedHex.r === this.r
    },

    translation() {
      // Each of these tiles has 2px of padding on it so subtract 4+1 before calculating position
      // Except ignore that for Y. There's probably a nice math way to figure out how much
      // to set each tile into each other... but I'm lazy so, #magicstrings
      var yTranslation = (this.r * (HEIGHT - 16)) + this.yOffset;
      var xTranslation = ((this.q + (this.r * .5)) * (WIDTH - 5)) + this.xOffset;

      return `matrix(1,0,0,1,${xTranslation},${yTranslation})`
    }
  },

  props: {
    q: {
      type: Number,
      default: 0
    },
    r: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: utils.constants.TILE.color
    },
    dragging: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    fog: {
      type: Boolean,
      default: utils.constants.TILE.fog
    },
    entities: {
      type: Object,
      default: () => {
        return { in: {} }
      }
    },
    stroke: {
      type: String,
      default: '#232323'
    },
    gridWidth: {
      type: Number,
      default: 1
    },
    selectable: {
      type: Boolean,
      default: true
    },
    xOffset: {
      type: Number,
      default: 0
    },
    viewOnly: {
      type: Boolean,
      default: false
    },
    yOffset: {
      type: Number,
      default: 0
    }
  },

  data () {
    var data = {
      height: HEIGHT,
      width: WIDTH
    }

    return data
  },

  methods: {

    entityComponent(entity) {
      switch (entity) {
        case 'door':
          return Door
          break

        default:
          return null
          break
      }
    },

    onClick($event) {
      var coords = {q: this.q, r: this.r}

      this.$emit('click', coords, $event)
      if (this.viewOnly) { return }
      var state = this.$store.state
      if (!state.editor) { return }

      if (state.tool.type === 'hex') {
        this.$store.commit('selectHex', coords)
      } else if (state.tool.type === 'erase') {
        this.$store.dispatch('eraseTile', coords)
      } else {
        switch (state.tool.coverage) {
          case 'single':
            this.$store.dispatch('drawTile', coords)
            break;

          case 'fill':
            this.$emit('fill', coords)
            break;
        }
      }
    },

    onHover($event) {
      this.$emit('hover', {q: this.q, r: this.r})
      if (this.viewOnly) { return }
      if (this.$store.state.tool.type !== 'hex') {
        this.$store.commit('hoverHex', {q: this.q, r: this.r })
      }
      if ($event.buttons && this.dragging) {
        this.onClick()
      }
    },

    openLayout(id) {
      this.$store.commit('openLayout', id)
    }
  }
}
</script>

<style scoped>

</style>
