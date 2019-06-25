<template>
  <div class="toast-wrap">
    <transition-group name="list" tag="div">
      <div v-for="note in activeNotifications"
           class="toast"
           v-bind:key="note.key">
        <p>
          <i v-bind:class="icon(note.type)"></i>

          {{ note.message }}
        </p>
      </div>
    </transition-group>
  </div>
</template>

<script>
const NOTIF_TIME = 3000

export default {
  beforeDestroy() {
    this.$eventHub.$off('notification')
  },

  created() {
    this.$eventHub.$on('notification', this.notify)
  },

  data () {
    return {
      queuedNotifications: [],
      activeNotifications: [],
      count: 0
    }
  },

  methods: {
    icon(type) {
      switch (type) {
        case 'warn':
          return 'fas fa-exclamation-circle'

        case 'deny':
          return 'fas fa-times-circle'
      }
    },

    notify(note) {
      this.count++
      note.key = `toast-${this.count}`
      this.queuedNotifications.push(note)
      if (this.activeNotifications.length < 5) {
        this.showNotification()
      }
    },

    removeNotification() {
      var removed = this.activeNotifications.shift()
      if (this.queuedNotifications.length) {
        this.showNotification()
        setTimeout(this.removeNotification.bind(this), NOTIF_TIME / 2)
      } else if (this.activeNotifications.length) {
        setTimeout(this.removeNotification.bind(this), NOTIF_TIME / 2)
      }
    },

    showNotification() {
      var note = this.queuedNotifications.pop()
      if (note) {
        this.activeNotifications.push(note)
        if (this.activeNotifications.length <= 1) {
          setTimeout(this.removeNotification.bind(this), NOTIF_TIME)
        }
      }
    }
  }
}

</script>

<style scoped>
  .toast-wrap {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .toast {
    text-align: center;
  }

  .toast:first-child p {
    border-radius: 0 0 var(--borderRadius) var(--borderRadius);
    margin-top: 0;
  }

  .toast p {
    display: inline-block;
    margin: 0;
    margin-top: .5rem;
    background: var(--white);
    border-radius: var(--borderRadius);
    padding: 1rem;
    box-shadow: 0px 0px .5rem 0 var(--gray-8);
    transition: border-radius .3s;
    font-weight: 600;
  }

  i {
    padding-right: .5rem;
  }

  i.fa-exclamation-circle {
    color: var(--yellow);
  }
  i.fa-times-circle {
    color: var(--red);
  }

  .list-enter-active, .list-leave-active, .list-leave-active ~ .toast {
    transition: all .3s;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
  }

  .list-leave-to, .list-leave-to ~ .toast {
    transform: translateY(-100%);
  }

  .list-leave-to ~ .toast:nth-child(2) p {
    border-radius: 0 0 var(--borderRadius) var(--borderRadius);
  }
</style>
