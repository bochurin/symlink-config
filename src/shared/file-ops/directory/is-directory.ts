import * as fs from 'fs'

export function isDirectory(path: string): boolean {
  try {
    return fs.statSync(path).isDirectory()
  } catch {
    return false
  }
}