import { log } from '@log'
import { SymlinkOperation } from '../utils'

import { join, dirname } from '@shared/file-ops'
import { statFile, directoryExists, createDirectory } from '@shared/file-ops'
import { createSymlink, removeSymlink } from '@shared/file-ops'

export async function createSymlinksDirectly(
  operations: SymlinkOperation[],
  workspaceRoot: string,
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  let failed = 0
  const errors: string[] = []

  for (const op of operations) {
    try {
      if (op.type === 'delete') {
        try {
          const stats = statFile(workspaceRoot, op.target)
          if (stats.isSymbolicLink()) {
            await removeSymlink(join(workspaceRoot, op.target))
            log(`Removed symlink: ${op.target}`)
            success++
          } else {
            log(`Skipped non-symlink: ${op.target}`)
          }
        } catch {
          // File doesn't exist, nothing to remove
        }
      } else if (op.type === 'create' && op.source) {
        const targetPath = join(workspaceRoot, op.target)
        const sourcePath = join(workspaceRoot, op.source.startsWith('@') ? op.source.slice(1) : op.source)
        
        // Create target directory if needed
        const targetDir = dirname(targetPath)
        const targetDirRelative = targetDir.replace(workspaceRoot, '').replace(/^[\\/]/, '')
        if (targetDirRelative && !directoryExists(workspaceRoot, targetDirRelative)) {
          await createDirectory(workspaceRoot, targetDirRelative, { recursive: true })
        }

        // Check if source exists
        try {
          statFile(workspaceRoot, op.source.startsWith('@') ? op.source.slice(1) : op.source)
        } catch {
          const error = `Source not found: ${sourcePath}`
          errors.push(error)
          log(`ERROR: ${error}`)
          failed++
          continue
        }

        // Remove existing target if it exists
        try {
          const stats = statFile(workspaceRoot, op.target)
          if (stats.isSymbolicLink()) {
            await removeSymlink(targetPath)
            log(`Removed existing symlink: ${op.target}`)
          } else {
            const error = `Target exists and is not a symlink: ${targetPath}`
            errors.push(error)
            log(`ERROR: ${error}`)
            failed++
            continue
          }
        } catch {
          // Target doesn't exist, which is fine
        }

        // Create symbolic link
        await createSymlink(sourcePath, targetPath)
        log(`Created symlink: ${op.target} -> ${op.source}`)
        success++
      }
    } catch (error) {
      const errorMsg = `Failed to process ${op.target}: ${error}`
      errors.push(errorMsg)
      log(`ERROR: ${errorMsg}`)
      failed++
    }
  }

  return { success, failed, errors }
}
