export default {
  getMap: function (id) {
    return fetch(`/maps/${id}.json`)
      .then(response => { return response.json() })
  },

  updateMap: function(id, params) {
    return fetch(`/maps/${id}`, {
      method: 'PUT',
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
