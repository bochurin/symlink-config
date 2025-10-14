import * as fs from 'fs'
import * as path from 'path'
import { getWorkspaceRoot } from '../state'

export function readDir(relativePath: string): fs.Dirent[] {
  try {
    const workspaceRoot = getWorkspaceRoot()
    const fullPath = path.join(workspaceRoot, relativePath)
    return fs.readdirSync(fullPath, { withFileTypes: true })
  } catch {
    return []
  }
}
