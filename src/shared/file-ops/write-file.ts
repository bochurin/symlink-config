import * as fs from 'fs/promises'
import { fullPath } from './full-path'

export async function writeFile(file: string, content: string) {
  const filePath = fullPath(file)

  try {
    await fs.writeFile(filePath, content, 'utf8')
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
