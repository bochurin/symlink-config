import * as fs from 'fs'
import { fullPath } from './full-path'

export function readSymlink(rootPath: string, file: string): string {
  return fs.readlinkSync(fullPath(rootPath, file))
}
