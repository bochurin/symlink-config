import * as fs from 'fs'
import { fullPath } from './full-path'

export function readFile(file: string): string {
  const filePath = fullPath(file)

  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}
