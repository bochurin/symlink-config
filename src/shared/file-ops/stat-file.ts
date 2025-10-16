import * as fs from 'fs'
import { fullPath } from './full-path'

export function statFile(rootPath: string, file: string): fs.Stats {
  return fs.statSync(fullPath(rootPath, file))
}
