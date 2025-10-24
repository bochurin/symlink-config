import { SymlinkOperation } from '../../../utils'
import { sourcePath } from '../path'
import { fullPath } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'

export function createSymlink(
  operation: SymlinkOperation,
  targetOS: 'windows' | 'unix',
): string[] {
  const workspaceRoot = getWorkspaceRoot()
  const targetPath = fullPath(workspaceRoot, operation.target)
  const { symlinkSource } = sourcePath(
    operation.source,
    operation.target,
    workspaceRoot,
    targetOS,
  )

  return [
    `echo "Creating symlink ${operation.target} -> ${operation.source}"`,
    targetOS === 'windows'
      ? `mklink ${operation.isDirectory ? '/D' : ''} "${targetPath}" "${symlinkSource}"`
      : `ln -sf "${symlinkSource}" "${targetPath}"`,
  ]
}
