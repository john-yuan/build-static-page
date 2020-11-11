import path from 'path'
import less from 'less'
import fse from 'fs-extra'
import { Request, Response, NextFunction } from 'express'
import { Config } from '../config'
import { fileExists } from '../utils/fileExists'

export interface Options {
  config: Config
}

export const lessMiddleware = (options: Options) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const filename = req.path
    const { config } = options

    if (/\.less$/i.test(filename)) {
      const lessPath = path.resolve(config.src, filename.replace(/^\/+/, ''))
      const statusMessage = 'Internal Server Error (Please check the log ' +
        'for more details)'

      if (fileExists(lessPath)) {
        try {
          less.render(fse.readFileSync(lessPath).toString(), {
            filename: lessPath
          }).then(({ css }) => {
            res.setHeader('Content-Type', 'text/css; charset=utf-8')
            res.send(css)
          }).catch((err) => {
            res.status(500)
            res.statusMessage = statusMessage
            res.send('')
            console.error(`Error: Failed to compile ${lessPath}`)
            console.error(err)
          })
        } catch (err) {
          res.status(500)
          res.statusMessage = statusMessage
          res.send('')
          console.error(`Error: Failed to read ${lessPath}`)
          console.error(err)
        }
      } else {
        res.status(404)
        res.send('')
      }
    } else {
      next()
    }
  }
}
