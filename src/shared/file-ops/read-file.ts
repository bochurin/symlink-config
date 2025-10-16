import * as fs from 'fs'
import { fullPath } from './full-path'

export function readFile(rootPath: string, file: string): string {
  const filePath = fullPath(rootPath, file)

  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}
