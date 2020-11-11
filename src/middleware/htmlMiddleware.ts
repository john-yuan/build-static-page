import path from 'path'
import ejs from 'ejs'
import prettier from 'prettier'
import { Request, Response, NextFunction } from 'express'
import { Config } from '../config'

export interface Options {
  config: Config;
}

export const htmlMiddleware = (options: Options) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { config } = options
    const filename = req.path.endsWith('/')
      ? `${req.path}index.html`
      : req.path

    if (/\.html$/i.test(filename)) {
      const htmlPath = path.resolve(config.src, filename.replace(/^\/+/, ''))
      const { templateGlobals } = config

      ejs.renderFile(htmlPath, templateGlobals, (err, str) => {
        if (err) {
          const code = (err as { code?: string }).code
          if (code === 'ENOENT') {
            next()
          } else {
            res.status(500)
            res.setHeader('Content-type', 'text/plain; charset=utf-8')
            res.send(`Error: Failed to render ${filename} with ejs.\n\n` +
              `${err.message}\n\nPlease check the log for more details.`)

            console.error(`Error: Failed to render ${htmlPath} with ejs.`)
            console.error(err)
          }
        } else {
          try {
            const htmlDir = path.dirname(htmlPath)
            const prettierConfigFile = prettier.resolveConfigFile.sync(htmlDir)
            const prettierConfig = prettierConfigFile
              ? (prettier.resolveConfig.sync(prettierConfigFile) || {})
              : {}

            const formatted = prettier.format(str, {
              ...prettierConfig,
              parser: 'html'
            })

            res.send(formatted)
          } catch (err) {
            res.status(500)
            res.setHeader('Content-type', 'text/plain; charset=utf-8')
            res.send(`Error: Failed to format ${filename}\n\n` +
              `${err.message}\n\nPlease check the log for more details.`)

            console.error(`Error: Failed to format ${htmlPath}`)
            console.error(err)
          }
        }
      })
    } else {
      next()
    }
  }
}
