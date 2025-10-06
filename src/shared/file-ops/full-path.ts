import * as path from 'path'

import * as state from '../../shared/state'

export function fullPath(endPath: string): string {
  const workspaceRoot = state.getWorkspaceRoot()
  const fullPath = path.join(workspaceRoot, endPath)
  return fullPath
}
