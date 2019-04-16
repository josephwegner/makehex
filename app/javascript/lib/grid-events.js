import utils from './utils.js'
import { EventEmitter } from 'eventemitter'

class GridEvents extends EventEmitter {

  constructor() {
    super()
    this.oldStates = []
    this.newStates = []
  }

  addStore(store) {
    this.store = store
    this.beginStateTracking()
  }

  addToState(changes) {
    if(changes.length > 0) {
      changes.map((change) => {
        if (typeof(change.entities) === 'undefined') {
          change.entities = {}
        }

        for(var prop in utils.constants.TILE) {
          if (typeof(change[prop]) === 'undefined') {
            change[prop] = utils.constants.TILE[prop]
          }
        }
      })

      this.oldStates.push(Array.from(changes))
      if (this.oldStates.length > 20) {
        this.oldStates.shift()
      }
      this.newStates = []
      this.sendUndoStatus()

      this.emit('tileChange', changes)
    }
  }

  applyStateChange(changes) {
    var oldValues = changes.map((change) => {
      return Object.assign({index: change.index}, this.store.getters.activeLayout.grid[change.index])
    })
    this.store.dispatch('overwrite', changes)
    this.emit('tileChange', oldValues)
    this.sendUndoStatus()
  }

  sendUndoStatus() {
    this.store.commit('undoStatus', {
      undoCount: this.oldStates.length,
      redoCount: this.newStates.length
    })
  }

  beginStateTracking() {
    this.oldStates = []
    this.newStates = []
    // We're gonna manually trigger state changes for now. See GridEvens.changed
    //this.store.watch(this.tilesFromState, this.checkForChanges.bind(this))

    //this.on('tileChange', this.addToState)
  }

  changed(changes) {
    this.addToState(changes)
  }

  undo () {
    if(this.oldStates.length) {
      var changes = this.oldStates.pop()
      this.newStates.push(changes.map((change) => {
        return Object.assign({index: change.index}, this.store.getters.activeLayout.grid[change.index])
      }))
      this.applyStateChange(changes)
    }
  }

  redo () {
    if(this.newStates.length) {
      var changes = this.newStates.pop()
      this.oldStates.push(changes.map((change) => {
        return Object.assign({index: change.index}, this.store.getters.activeLayout.grid[change.index])
      }))
      this.applyStateChange(changes)
    }
  }
}

export default new GridEvents()
