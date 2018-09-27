export default {
  getMap: function (id) {
    return fetch(`/map/${id}`)
      .then(response => { return response.json() })
  }
}
