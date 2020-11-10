const fse = require('fs-extra')
const path = require('path')

fse.chmodSync(path.resolve(__dirname, '../dist/bin.js'), 0o755)
