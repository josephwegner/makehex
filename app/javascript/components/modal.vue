<template>
  <div v-if="show" class="modal-bg">
    <div class="modal">
      <i v-on:click="close()" class="close-modal fa fa-times-circle"></i>
      <component v-bind:is="component" />
    </div>
  </div>
</template>

<script>
// Modal components
import Metadata from './modal-components/metadata.vue'

export default {
  computed: {
    show () {
      return this.$store.state.modal.open
    },

    component () {
      return this.$store.state.modal.component
    }
  },

  components: {
    Metadata
  },

  methods: {
    close () {
      if (this.$children.length && typeof(this.$children[0].prepareToClose) === 'function') {
        this.$children[0].prepareToClose()
      }
      this.$store.commit('closeModal')
    }
  }
}

</script>

<style scoped>
 .modal-bg {
   position: absolute;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   background: var(--shadow);
 }

 .modal {
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translateX(-50%) translateY(-50%);
   width: 44rem;
   background: var(--lightestGray);
   border-radius: var(--borderRadius);
   border: 2px solid var(--gray);
   padding: 1rem;
 }

 .close-modal {
   font-size: 1.5rem;
   position: absolute;
   top: .5rem;
   right: .5rem;
   cursor: pointer;
   color: --var(white);
   transition: color .1s;
 }

 .close-modal:hover {
   color: var(--darkWhite);
 }
</style>

<style>
  .modal-bg * {
    color: var(--white);
  }
</style>
