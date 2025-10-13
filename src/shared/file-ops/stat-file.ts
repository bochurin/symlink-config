import * as fs from 'fs'
import { fullPath } from './full-path'

export function statFile(file: string): fs.Stats {
  return fs.statSync(fullPath(file))
}
