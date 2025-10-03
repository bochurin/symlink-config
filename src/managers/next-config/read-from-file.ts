import * as fs from 'fs'
import * as path from 'path'

import * as state from '../../shared/state'

export function readFromFile(): string {
  try {
    const workspaceRoot = state.getWorkspaceRoot()
    const nextConfigPath = path.join(workspaceRoot, 'next.symlink.config.json')
    const content = fs.readFileSync(nextConfigPath, 'utf8')

    return content
  } catch {
    return ''
  }
}
