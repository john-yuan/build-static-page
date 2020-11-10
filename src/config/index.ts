import path from 'path'

import { readAsString } from '../utils/readAsString'

export interface Config {
  src: string;
  dist: string;
  port: number;
  host: string;
  templateGlobals: { [name: string]: unknown }
}

export const readConfig = (
  configPath: string,
  mode: string
): Partial<Config> => {
  const configDir = path.dirname(configPath)
  const configFn = require(configPath) as (mode: string) => Config

  if (typeof configFn !== 'function') {
    throw new Error('Config is not a function.')
  }

  const config = configFn(mode)
  const src = readAsString(config.src)
  const dist = readAsString(config.dist)

  if (src) {
    config.src = path.resolve(configDir, src)
  }

  if (dist) {
    config.dist = path.resolve(configDir, dist)
  }

  return config
}

export const checkConfig = (config: Partial<Config>): Config => {
  const src = readAsString(config.src)
  const dist = readAsString(config.dist)
  const host = readAsString(config.host) || '0.0.0.0'
  const port = config.port ? Math.floor(+config.port) : 4003
  const templateGlobals = config.templateGlobals || {}

  if (!src) {
    throw new Error('The "src" directory is required in config.')
  }

  if (!dist) {
    throw new Error('The "dist" directory is required in config.')
  }

  if (isNaN(port)) {
    throw new Error('The "port" must be a number.')
  }

  return {
    src: path.resolve(src),
    dist: path.resolve(dist),
    host,
    port,
    templateGlobals
  }
}
