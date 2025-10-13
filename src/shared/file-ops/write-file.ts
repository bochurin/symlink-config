import * as fs from 'fs/promises'
import { fullPath } from './full-path'

export async function writeFile(file: string, content: string, mode?: number) {
  const filePath = fullPath(file)

  try {
    await fs.writeFile(filePath, content, { encoding: 'utf8', mode })
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
