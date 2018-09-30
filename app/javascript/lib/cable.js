import ActionCable from 'actioncable'

class Cable {
  constructor() {
    this.ac = ActionCable.createConsumer();
  }

  loadStore(store) {
    this.store = store

    this.store.watch((state) => {
      if (!state.map) return null
      return state.map.id
    }, this.connectToMapResources.bind(this))
  }

  disconnectFromMapResources() {
    // noop
    console.log('TODO: disconnect from map')
  }

  connectToMapResources() {
    this.tileChannel = this.ac.subscriptions.create({
      channel: 'TileChannel',
      layout: this.store.state.activeLayoutId
    }, { received: this.layoutUpdate.bind(this) })

    this.mapChannel = this.ac.subscriptions.create({
      channel: 'MapChannel',
      map: this.store.state.map.id
    }, { received: this.mapUpdate.bind(this) })
  }

  sendLayoutUpdate(data) {
    this.tileChannel.send(data)
  }

  layoutUpdate(data) {
    console.log('layoutUpdate', data)
    this.store.commit('updateTile', data)
  }

  mapUpdate(data) {
    this.store.commit('updateLayoutGrid', data)
  }
}

export default new Cable()
