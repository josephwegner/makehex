const { environment } = require('@rails/webpacker')
const vue = require('./loaders/vue')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

Object.keys(vue.loaders).forEach(name => {
  environment.loaders.append(name, vue.loaders[name])
})

Object.keys(vue.plugins).forEach(name => {
  environment.plugins.append(name, vue.plugins[name])
})

environment.plugins.prepend(
  'svg-spritemap-webpack-plugin',
  new SVGSpritemapPlugin('app/assets/tilecons/*.svg', {
    output: {
      filename: 'tilecons.svg',
    },
    sprite: {
      prefix: () => { return '' },
      generate: {
        symbol: true
      }
    }
  })
)

module.exports = environment
