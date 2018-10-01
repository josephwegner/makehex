<template>
  <div class="toolbox">
    <button
      v-for="(label, value) in options"
      v-bind:class="{ active: value === selected }"
      v-on:click="onUpdate(value)">

      {{ label }}
    </button>
  </div>
</template>

<script>

export default {
  props: ['options', 'selected', 'onUpdate']
}

</script>

<style scoped>
  .toolbox {
    background: var(--midGray);
    border: 1px solid var(--darkGray);
    margin: 8px;
    border-radius: var(--borderRadius);
  }

  button {
    border: none;
    border-right: 1px solid var(--darkGray);
    padding: 0 8px;
    background: transparent;
    height: 100%;
    color: var(--darkWhite);
    cursor: pointer;
    outline: none;
  }

  button:hover {
    background-color: var(--gray);
  }

  .active {
    background-color: var(--darkGray);
  }

  .active:hover {
    background-color: var(--darkGray);
  }
</style>
