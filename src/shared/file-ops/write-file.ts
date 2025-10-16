import * as fs from 'fs/promises'
import { fullPath } from './full-path'

export async function writeFile(
  rootPath: string,
  file: string,
  content: string,
  mode?: number,
) {
  const filePath = fullPath(rootPath, file)

  try {
    await fs.writeFile(filePath, content, { encoding: 'utf8', mode })
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
