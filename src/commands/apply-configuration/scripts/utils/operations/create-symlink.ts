import { fullPath } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'

import { SymlinkOperation } from '../../../utils'

// Note: sourcePath functionality needs to be implemented using shared abstractions

export function createSymlink(
  operation: SymlinkOperation,
  targetOS: 'windows' | 'unix',
): string[] {
  const workspaceRoot = getWorkspaceRoot()
  const targetPath = fullPath(workspaceRoot, operation.target)
  // TODO: Implement sourcePath using shared abstractions
  const symlinkSource = operation.source || ''

  return [
    `echo "Creating symlink ${operation.target} -> ${operation.source}"`,
    targetOS === 'windows'
      ? `mklink ${operation.isDirectory ? '/D' : ''} "${targetPath}" "${symlinkSource}"`
      : `ln -sf "${symlinkSource}" "${targetPath}"`,
  ]
}
