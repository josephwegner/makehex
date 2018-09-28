import ActionCable from 'actioncable'

class Cable {
  constructor() {
    this.ac = ActionCable.createConsumer();
  }

  loadMap(id, store) {
    this.store = store
    this.mapChannel = this.ac.subscriptions.create({
      channel: 'MapChannel',
      map: id
    }, { received: this.mapUpdate.bind(this) })
  }

  sendForMap(data) {
    console.log('sending data', data)
    console.log(this.mapChannel)
    this.mapChannel.send(data)
  }

  mapUpdate(data) {
    this.store.commit('updateTile', data)
  }
}

export default new Cable()
