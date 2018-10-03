export default {
  getMap: function (id) {
    return fetch(`/maps/${id}.json`)
      .then(response => { return response.json() })
  }
}
