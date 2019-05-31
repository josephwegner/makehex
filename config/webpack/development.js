process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const webpack = require('webpack')
const environment = require('./environment')
const config = environment.toWebpackConfig()

config.plugins = (config.plugins || []).concat([
  new webpack.EnvironmentPlugin([ 'NODE_ENV' ])
])

module.exports = environment.toWebpackConfig()
