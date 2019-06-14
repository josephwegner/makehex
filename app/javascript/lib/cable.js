import ActionCable from 'actioncable'

class Cable {
  constructor() {
    this.ac = ActionCable.createConsumer()
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
    }, { received: (message) => {
      switch (message.method) {
        case 'pushLayout':
          this.mapUpdate(message.payload)
          break

        case 'updatePlayer':
          this.receivePlayer(message.payload)
          break
      }
    }})
  }

  disconnectFromTile() {
    this.tileChannel.unsubscribe()
    delete this.tileChannel
  }

  sendTileUpdate(coords) {
    if (coords.length === undefined) {
      coords = [coords]
    }
    var updates = coords.map(coord => {
      return Object.assign({q: coord.q, r: coord.r}, this.store.getters.activeLayout.grid[coord.q][coord.r])
    })

    this.tileChannel.send({
      method: 'updateTiles',
      payload: updates
    })
  }

  pushLayout(layout) {
    this.tileChannel.send({
      method: 'pushLayout',
      payload: layout
    })
  }

  layoutUpdate(data) {
    this.store.commit('updateTile', { tiles: data, source: 'server' })
  }

  mapUpdate(data) {
    this.store.commit('updateLayoutGrid', data)
  }

  receivePlayer(data) {
    this.store.commit('movePlayer', data)
  }

  updatePlayer(player) {
    this.mapChannel.send({
      method: 'movePlayer',
      payload: player
    })
  }
}

export default new Cable()
