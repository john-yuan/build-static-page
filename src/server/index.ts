import express from 'express'
import { green, cyan } from 'chalk'
import { getIpAddresses } from '../utils/getIpAddresses'
import { Config, checkConfig } from '../config'

export const serve = (config: Partial<Config>) => {
  const app = express()
  const checkedConfig = checkConfig(config)
  const { src, host, port } = checkedConfig
  const addresses = getIpAddresses().filter((addr) => addr !== '127.0.0.1')

  app.use(express.static(src))

  app.listen(port, host, 511, () => {
    const relativeSrc = src.replace(process.cwd(), '.').replace(/\\/g, '/')
    console.log(green('Serving:'))
    console.log(cyan(`  ${relativeSrc}`))
    console.log(green('Server running at:'))

    if (host === '0.0.0.0') {
      console.log('  Local:   ' + cyan(`http://localhost:${port}/`))
      addresses.forEach((ip) => {
        console.log('  Network: ' + cyan(`http://${ip}:${port}/`))
      })
    } else {
      console.log(cyan(`  http://${host}:${port}/`))
    }
  })
}
