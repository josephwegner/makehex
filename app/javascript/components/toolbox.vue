<template>
  <div class="toolbox">
    <slot></slot>
  </div>
</template>

<script>

export default {

}

</script>

<style scoped>
  .toolbox {
    height: 5rem;
    padding: 0 .5rem;
    box-sizing: border-box;
    background-color: var(--blueWhite);
    border-left: 1px solid var(--lightestBlue);
    display: flex;
  }
</style>
