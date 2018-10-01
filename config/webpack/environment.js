const { environment } = require('@rails/webpacker')
const vue =  require('./loaders/vue')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

environment.loaders.append('vue', vue)

environment.plugins.prepend(
  'svg-spritemap-webpack-plugin',
  new SVGSpritemapPlugin({
    src: 'app/assets/tilecons/*.svg',
    filename: 'tilecons.svg',
    prefix: '',
    generate: {
      symbol: true
    }
  })
)

module.exports = environment
