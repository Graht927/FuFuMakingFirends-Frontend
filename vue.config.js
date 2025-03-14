const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@wxcomponents': path.resolve(__dirname, 'src/wxcomponents')
      }
    }
  }
} 