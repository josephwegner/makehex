<template>
  <div class="icon-picker">
    <div v-if="open" class="icon-modal">
      <svg v-for="(details, icon) in tilecons"
           v-on:click="select(icon)"
           v-bind:class="{ selected: icon === selected } ">

        <use v-bind:href="'/packs/tilecons.svg#' + icon" />
      </svg>
    </div>

    <div class="selected-icon"
         v-bind:class="{ empty: empty }"
         v-on:click="open = !open" >

      <svg><use v-bind:href="'/packs/tilecons.svg#' + previewIcon" />
      </svg>
    </div>
  </div>
</template>

<script>
import Tilecons from '../lib/tilecons.js'

export default {
  data() {
    return {
      open: false,
      tilecons: Tilecons
    }
  },

  computed: {
    empty() {
      return this.selected === null
    },

    previewIcon() {
      return this.selected ? this.selected : 'denied'
    }
  },

  methods: {
    select(icon) {
      if (this.selected === icon) {
        this.onUpdate(null)
      } else {
        this.onUpdate(icon)
        this.open = false
      }
    }
  },

  props: ['selected', 'onUpdate']
}

</script>

<style scoped>
  .icon-picker {
    height: 100%;
    width: var(--toolWidth);
    box-sizing: border-box;
    padding: 8px 0;
    margin: 0 4px;
    position: relative;
  }

  .icon-modal {
    background-color: var(--midGray);
    border-radius: var(--borderRadius);
    position: absolute;
    left: 50%;
    bottom: 100%;
    transform: translateX(-50%) translateY(-10px);
    display: flex;
    flex-wrap: wrap;
    width: 240px;
    box-shadow: 0 0 10px 0 var(--darkGray);
  }

  .icon-modal:after {
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

  .icon-modal svg {
    height: 32px;
    width: 32px;
    background-color: var(--darkWhite);
    margin: 4px;
    border-radius: var(--borderRadius);
    cursor: pointer;
    box-sizing: border-box;
  }

  .icon-modal .selected {
    background-color: var(--white);
  }

  .selected-icon {
    height: 100%;
    width: 100%;
    border-radius: var(--borderRadius);
    background-color: var(--darkWhite);
    box-sizing: border-box;
    border: 2px solid var(--darkGray);
  }

  .selected-icon svg {
    height: 28px;
    width: 28px;
    stroke: var(--darkGray);
  }

  .selected-icon.empty svg {
    stroke: var(--red);
  }
</style>
