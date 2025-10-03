import * as fs from 'fs'
import * as path from 'path'
import * as state from '../state'

export function readFile(file: string): string {
  const workspaceRoot = state.getWorkspaceRoot()
  const filePath = path.join(workspaceRoot, file)

  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}
