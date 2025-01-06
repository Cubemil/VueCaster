const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false)
      })
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        }
      }
    }
  }
})