<template>
  <div class="icon-picker">
    <div v-if="open" class="toolbar-modal">
      <svg v-on:click="select(null)"
           v-bind:class="{ selected: !selected, chooseEmpty: true } ">

        <use href="/packs/tilecons.svg#denied" />
      </svg>
      <svg v-for="(details, icon) in tilecons"
           v-on:click="select(icon)"
           v-bind:class="{ selected: icon === selected } ">

        <use v-bind:href="'/packs/tilecons.svg#' + icon" />
      </svg>
    </div>

    <div class="selected-icon"
         v-bind:class="{ empty: empty }"
         v-on:click="$emit('click')" >

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
        this.$emit('close')
      }
    }
  },

  props: ['open', 'selected', 'onUpdate']
}

</script>

<style scoped>
  .icon-picker {
    height: 100%;
    width: var(--toolWidth);
    box-sizing: border-box;
    padding: 0;
    margin: 0 4px;
    position: relative;
  }

  .toolbar-modal {
    width: 15rem;
    display: flex;
    flex-wrap: wrap;
  }

  .toolbar-modal svg {
    height: 32px;
    width: 32px;
    background-color: var(--darkWhite);
    margin: 4px;
    border-radius: var(--borderRadius);
    cursor: pointer;
    box-sizing: border-box;
  }

  .toolbar-modal .selected {
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

  .selected-icon.empty svg,
  .chooseEmpty {
    stroke: var(--red);
  }
</style>
