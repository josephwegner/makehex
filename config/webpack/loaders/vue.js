const { dev_server: devServer } = require('@rails/webpacker').config

const isProduction = process.env.NODE_ENV === 'production'
const inDevServer = process.argv.find(v => v.includes('webpack-dev-server'))
const extractCSS = !(inDevServer && (devServer && devServer.hmr)) || isProduction
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  loaders: {
  vue: {
      test: /\.vue(\.erb)?$/,
      use: [{
        loader: 'vue-loader'
      }]
    },
    css: {
      test: /\.css$/,
      use: [
        extractCSS ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }
  },

  plugins: {
    css: new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    vue: new VueLoaderPlugin
  }
}
