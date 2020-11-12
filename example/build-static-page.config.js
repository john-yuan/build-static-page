const path = require('path')

module.exports = function (mode) {
  return {
    src: path.resolve(__dirname, 'www'),
    dist: path.resolve(__dirname, 'dist'),
    port: 4003,
    tryNextPort: true,
    templateGlobals: {
      MODE: mode
    }
  }
}
