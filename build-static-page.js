const path = require('path')

module.exports = function (mode) {
  return {
    src: path.resolve(__dirname, 'example/www'),
    dist: path.resolve(__dirname, 'example/dist'),
    port: 4003,
    templateGlobals: {
      MODE: mode
    }
  }
}
