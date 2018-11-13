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
    }, this.connectToMap.bind(this))
  }

  disconnectFromMapResources() {
    // noop
    console.log('TODO: disconnect from map')
  }

  connectToMapResources() {
    connectToTile(this.store.state.activeLayoutId)
    connectToMap(this.store.state.map.id)
  }

  connectToTile(layoutId) {
    if (this.tileChannel) { this.disconnectFromTile() }

    console.log('connect to tile')
    this.tileChannel = this.ac.subscriptions.create({
      channel: 'TileChannel',
      layout: layoutId
    }, { received: this.layoutUpdate.bind(this) })
  }

  connectToMap() {
    if (this.mapChannel) {
      // noop
    }
    this.mapChannel = this.ac.subscriptions.create({
      channel: 'MapChannel',
      map: this.store.state.map.id
    }, { received: this.mapUpdate.bind(this) })
  }

  disconnectFromTile() {
    this.tileChannel.unsubscribe()
    delete this.tileChannel
  }

  sendTileUpdate(data) {
    console.log('sendTileUpdate')
    this.tileChannel.send({
      method: 'updateTiles',
      payload: data
    })
  }

  pushLayout(layout) {
    this.tileChannel.send({
      method: 'pushLayout',
      payload: layout
    })
  }

  layoutUpdate(data) {
    this.store.commit('updateTile', data)
  }

  mapUpdate(data) {
    this.store.commit('updateLayoutGrid', data)
  }
}

export default new Cable()
