export default {
  createLayout: function(mapId, name) {
    return fetch(`/layouts`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        map: mapId,
        layout: {
          name: name
        }
      }),
      headers: {
        'X-CSRF-Token': document.querySelectorAll("meta[name='csrf-token']")[0].getAttribute('content'),
        'Content-Type': 'application/json'
      }
    }).then(response => { return response.json() })
  },

  getMap: function (id) {
    return fetch(`/maps/${id}.json`)
      .then(response => { return response.json() })
  },

  updateMap: function(id, params) {
    return fetch(`/maps/${id}`, {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({
        map: params
      }),
      headers: {
        'X-CSRF-Token': document.querySelectorAll("meta[name='csrf-token']")[0].getAttribute('content'),
        'Content-Type': 'application/json'
      }
    })
  },

  updateLayout: function(id, params) {
    return fetch(`/layouts/${id}`, {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({
        layout: params
      }),
      headers: {
        'X-CSRF-Token': document.querySelectorAll("meta[name='csrf-token']")[0].getAttribute('content'),
        'Content-Type': 'application/json'
      }
    })
  }
}
