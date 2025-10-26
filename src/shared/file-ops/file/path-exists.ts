import * as fs from 'fs'

export function pathExists(path: string): boolean {
  return fs.existsSync(path)
}