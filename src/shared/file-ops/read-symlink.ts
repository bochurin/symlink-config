import * as fs from 'fs'
import { fullPath } from './full-path'

export function readSymlink(file: string): string {
  return fs.readlinkSync(fullPath(file))
}
