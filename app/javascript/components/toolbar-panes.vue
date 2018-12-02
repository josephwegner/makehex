<template>
  <div class="toolbar-panes">
    <slot></slot>
  </div>
</template>

<script>
export default {
}

</script>

<style scoped>
  .toolbar-panes {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    bottom: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
    pointer-events: none;
  }
</style>

<style>
  .toolbar-panes .pane {
    box-shadow: inset 0 -3px 3px -2px var(--darkGray), 0px 0px 6px 0px var(--darkGray);
    background-color: var(--midGray);
    border-radius: var(--borderRadius) var(--borderRadius) 0 0;
    border: 2px solid var(--darkGray);
    border-bottom: none;
    z-index: 3;
  }

  .toolbar-panes .pane-header {
    color: var(--white);
    border-bottom: 1px solid var(--darkGray);
    padding: .25rem .5rem;
  }

  .toolbar-panes .pane-content {
    padding: .5rem;
  }
</style>
