import fse from 'fs-extra'

export const fileExists = (filename: string) => {
  try { return fse.statSync(filename).isFile() } catch (err) {}
  return false
}
