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
    for (var q in changes) {
      for (var r in changes[q]) {
        var change = changes[q][r]

        if (typeof(change.entities) === 'undefined') {
          change.entities = {}
        }

        for(var prop in utils.constants.TILE) {
          if (typeof(change[prop]) === 'undefined') {
            change[prop] = utils.constants.TILE[prop]
          }
        }
      }
    }

    this.oldStates.push(changes)
    if (this.oldStates.length > 20) {
      this.oldStates.shift()
    }
    this.newStates = []
    this.sendUndoStatus()

    this.emit('tileChange', changes)
  }

  applyStateChange(changes) {
    var oldValues = {}
    for (var q in changes) {
      oldValues[q] = {}
      for (var r in changes[q]) {
        var change = changes[q][r]

        oldValues[q][r] = Object.assign(
          {q: q, r: r},
          this.store.getters.activeLayout.grid[q][r]
        )
      }
    }

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
      var fullChanges = {}
      for (var q in changes) {
        fullChanges[q] = {}
        for (var r in changes[q]) {
          fullChanges[q][r] = Object.assign(
            {q: q, r: r},
            this.store.getters.activeLayout.grid[q][r]
          )
        }
      }
      this.newStates.push(fullChanges)
      this.applyStateChange(changes)
    }
  }

  redo () {
    if(this.newStates.length) {
      var changes = this.newStates.pop()
      var fullChanges = {}
      for (var q in changes) {
        fullChanges[q] = {}
        for (var r in changes[q]) {
          fullChanges[q][r] = Object.assign(
            {q: q, r: r},
            this.store.getters.activeLayout.grid[q][r]
          )
        }
      }
      this.oldStates.push(fullChanges)
      this.applyStateChange(changes)
    }
  }
}

export default new GridEvents()
