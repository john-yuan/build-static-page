import express from 'express'
import { green, cyan } from 'chalk'
import { Config, checkConfig } from '../config'
import { getIpAddresses } from '../utils/getIpAddresses'
import { htmlMiddleware } from '../middleware/htmlMiddleware'
import { lessMiddleware } from '../middleware/lessMiddleware'

export const serve = (config: Partial<Config>) => {
  return new Promise((resolve, reject) => {
    const app = express()
    const checkedConfig = checkConfig(config)
    const { src, host, tryNextPort } = checkedConfig
    const relativeSrc = src.replace(process.cwd(), '.').replace(/\\/g, '/')
    const addresses = getIpAddresses().filter((addr) => addr !== '127.0.0.1')

    app.use(htmlMiddleware({ config: checkedConfig }))
    app.use(lessMiddleware({ config: checkedConfig }))
    app.use(express.static(src))

    const log = (message: string) => console.log(message)
    const listen = (port: number) => {
      app.listen(port, host, 511, () => {
        log(green('Serving:'))
        log(cyan(`  ${relativeSrc}`))
        log(green('Server running at:'))

        if (host === '0.0.0.0') {
          log('  Local:   ' + cyan(`http://localhost:${port}/`))
          addresses.forEach((ip) => {
            log('  Network: ' + cyan(`http://${ip}:${port}/`))
          })
        } else {
          log(cyan(`  http://${host}:${port}/`))
        }

        resolve(port)
      }).on('error', (err: { code: string }) => {
        if (tryNextPort && err && err.code === 'EADDRINUSE') {
          listen(port + 1)
        } else {
          reject(err)
        }
      })
    }

    listen(checkedConfig.port)
  })
}
