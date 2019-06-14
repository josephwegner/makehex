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
         class="icon"
         v-bind:href="`/packs/tilecons.svg#${icon}`"
         v-bind:height="height"
         v-bind:width="width"
         v-bind:stroke="entityColor"></use>

    <use v-if="inEntities.link && inEntities.link.layout && !fog"
         v-bind:href="inEntities.link.locked ? '#arrow-out-right-locked' : '#arrow-out-right'"
         class="clickable-svg"
         height="20"
         width="20"
         x="11.5"
         y="4"
         v-on:click="openLayout(inEntities.link.layout)"
         v-bind:stroke="entityColor"
         v-bind:fill="entityColor"></use>

    <text v-if="label && !fog"
          x="19.5"
          y="26"
          v-bind:stroke="entityColor"
          v-bind:fill="entityColor"
          text-anchor="middle">

          {{label}}
    </text>


    <component v-for="entity in dirEntities"
               ng-if="entity.entity"
               v-bind:is="entity.entity"
               v-bind:color="entityColor"
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
    entityColor() {
      var color = this.color.replace('#','')
      if (color.length === 3) {
        color = color + color
      }

      var r = parseInt(color.substr(0,2),16);
    	var g = parseInt(color.substr(2,2),16);
    	var b = parseInt(color.substr(4,2),16);
    	var yiq = ((r*299)+(g*587)+(b*114))/1000;
    	return (yiq >= 65) ? '#222' : '#DDD';
    },

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
    label: {
      type: String,
      default: ''
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

      if (state.tool.type === 'hex') {
        this.$store.commit('selectHex', coords)
      } else if (state.tool.type === 'erase') {
        this.$store.dispatch('eraseTile', coords)
      } else if (state.tool.type === 'player') {
        if (this.fog) {
          this.$eventHub.$emit('notification', {
            type: 'warn',
            message: 'That tile is not visible yet!'
          })
          return
        }

        var playerOnEntity = this.$store.state.map.players.find(player => {
          return player.location_q === coords.q &&
                 player.location_r === coords.r &&
                 player.layout === this.$store.state.activeLayoutId
        })
        if (playerOnEntity) {
          this.$eventHub.$emit('notification', {
            type: 'deny',
            message: "There's already a character there!"
          })
          return
        }

        this.$store.dispatch('movePlayer', coords)
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
      if (!this.inEntities.link.locked || this.$store.state.editor) {
        this.$store.commit('openLayout', id)
      } else {
        this.$eventHub.$emit('notification', {
          type: 'deny',
          message: "That's locked!"
        })
      }
    }
  }
}
</script>

<style scoped>
  .icon {
    pointer-events: none;
  }

  text {
    font-size: .75rem;
    font-family: 'TeX Gyre Bonum';
    letter-spacing: 1px;
  }
</style>
