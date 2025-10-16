import * as fs from 'fs'
import * as path from 'path'

export function readDir(rootPath: string, relativePath: string): fs.Dirent[] {
  try {
    const fullPath = path.join(rootPath, relativePath)
    return fs.readdirSync(fullPath, { withFileTypes: true })
  } catch {
    return []
  }
}
