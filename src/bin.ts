#!/usr/bin/env node
import path from 'path'
import { readConfig, Config } from './config'
import { parseArgv } from './utils/parseArgv'
import { readAsString } from './utils/readAsString'
import { serve } from './server'

const argv = parseArgv(process.argv.slice(2))
const mode = readAsString(argv.option.mode) || 'development'
const defaultConfig = 'build-static-page.config.js'
const configOption = readAsString(argv.option.config) || defaultConfig
const configPath = path.resolve(configOption)

let config: Partial<Config>

try {
  config = readConfig(configPath, mode)
} catch (err) {
  console.error(`Error: Cannot to read config from ${configOption}`)
  console.error(err)
  process.exit(1)
}

if (config) {
  if (argv.actions[0] === 'serve') {
    const host = readAsString(argv.option.host)
    const port = readAsString(argv.option.port)

    if (host) {
      config.host = host
    }

    if (port) {
      config.port = Math.floor(+port)

      if (isNaN(config.port)) {
        console.error(`Error: Invalid port ${port}.`)
        process.exit(1)
      }
    }

    serve(config).catch((err) => {
      console.error('Error: Failed to start server.')
      console.error(err)
      process.exit(1)
    })
  } else {
    if (argv.actions.length === 0) {
      console.log('Usage:')
      console.log('  npx build-static-page serve')
      console.log('  npx build-static-page build')
      process.exit(0)
    } else {
      console.error(`Error: unknown action ${argv.actions.join(' ')}`)
      process.exit(1)
    }
  }
}
