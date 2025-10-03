import * as fs from 'fs'
import * as path from 'path'
import * as state from '../state'

export function writeFile(file: string, content: string) {
  const workspaceRoot = state.getWorkspaceRoot()
  const filePath = path.join(workspaceRoot, file)

  try {
    fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
