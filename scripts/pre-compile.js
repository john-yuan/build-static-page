const fse = require('fs-extra')
const path = require('path')
const dist = path.resolve(__dirname, '../dist')

fse.removeSync(dist)
