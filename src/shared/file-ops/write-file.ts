import * as fs from 'fs/promises'
import * as path from 'path'
import * as state from '../state'

export async function writeFile(file: string, content: string) {
  const workspaceRoot = state.getWorkspaceRoot()
  const filePath = path.join(workspaceRoot, file)

  try {
    await fs.writeFile(filePath, content, 'utf8')
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
