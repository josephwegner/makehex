<template>
  <div class="icon-options">
    <i class="icon-wrapper font-mh hex"
       v-on:click="set(null)"
       v-bind:class="{ selected: value === null, chooseEmpty: true } ">

      <svg>
        <use href="/packs/tilecons.svg#denied" />
      </svg>
    </i>
    <i v-bind:class="{'icon-wrapper': true, 'font-mh': true, hex: true, selected: value === icon}"
       v-for="(details, icon) in tilecons"
       v-on:click="set(icon)">

      <svg>
        <use v-bind:href="'/packs/tilecons.svg#' + icon" />
      </svg>
    </i>
  </div>
</template>

<script>
import Tilecons from '../../lib/tilecons.js'

export default {
  computed: {
    value () {
      return this.$store.state.drawTools.icon
    }
  },

  data() {
    return {
      tilecons: Tilecons
    }
  },

  methods: {
    set(val) {
      this.$store.commit('updateDrawTool', { icon: val })
    }
  },

  props: ['close']
}

</script>

<style scoped>
  .icon-options {
    display: flex;
  }

  i {
    font-size: 2rem;
    color: var(--gray-2);
    position: relative;
    margin: .5rem .25rem;
    cursor: pointer;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 3px;
    stroke: var(--black);
  }

  .selected {
    color: var(--lightBlue);
  }

  .selected svg, .selected.chooseEmpty svg {
    stroke: var(--white);
    fill: var(--white);
  }

  .chooseEmpty svg {
    stroke: var(--red);
    stroke-width: 10px;
  }
</style>
