//console.log(__dirname)
const renderer = require('vue-server-renderer').createRenderer()

var SVGO = require('svgo')
var jsdom = require('jsdom')
var dom = new jsdom.JSDOM()
global.window = dom.window
global.document = window.document
global.WebSocket = window.WebSocket
global.window.isSSR = true

var defs = '<defs><polygon id="hex" points="36.64101615137754,12,36.64101615137754,32 19.32050807568877,42,2,32 2,12,19.32050807568877,2"></polygon><symbol id="arrow-out-right" viewBox="0 0 200 200"><path stroke-width="7" d="M40,90 L120,90 120,60 160,100 120,140 120,110 40,110" /></symbol><symbol id="arrow-out-right-locked" viewBox="0 0 200 200"><path stroke-width="7" d="M40,90 L120,90 120,60 160,100 120,140 120,110 40,110" /><rect x="40" y="60" width="60" height="30" /><path stroke-width="10" stroke="black" fill="transparent" d="M50 60 a 5 7 0 0 1 40 0" /></symbol></defs>'

const packUrl = `${__dirname}/../public${process.argv[2]}`
const layout = JSON.parse(process.argv[3])

const pack = require(packUrl)
var Vue = pack.Vue
const Store = pack.Store
const Grid = pack.Grid

var store = new Store({}).store
var map = {
  id: 1,
  layouts: [layout],
  players: []
}


store.commit('addMap', map)
store.commit('openLayout', layout.id)

Vue.config.productionTip = false
Vue.config.devtools = false
const app = new Vue({
  template: `<Grid v-bind:drawFog="false" />`,
  components: {Grid},
  store: store
})

// Step 2: Create a renderer

// Step 3: Render the Vue instance to HTML
renderer.renderToString(app, (err, svg) => {
  if (err) throw err
  var final = svg
    .replace(/<!---->/g, '')
    .replace(/> +</g, '><')
    .replace(/data-[A-Za-z0-9-]+="[A-Za-z0-9-]+"/g, '')
    .replace(/data-[A-Za-z0-9-]+/g, '')
  var startIndex = final.indexOf('<g id="map-tiles"')
  final = final.slice(0, startIndex) + defs + final.slice(startIndex)

  svgo = new SVGO()
  svgo.optimize(final).then((result) => {
    console.log(result.data)
  })

  //console.log(final)
})
