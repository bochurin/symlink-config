import { log } from '@log'
import { useCurrentSymlinkConfigManager } from '@managers'
import { join , statFile , removeSymlink } from '@shared/file-ops'



export async function removeSymlinksDirectly(
  workspaceRoot: string,
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  let failed = 0
  const errors: string[] = []

  const currentConfigManager = useCurrentSymlinkConfigManager()
  const currentConfig = currentConfigManager.read()

  if (!currentConfig) {
    return { success: 0, failed: 0, errors: ['No current symlink configuration found'] }
  }

  const config = JSON.parse(currentConfig)

  // Remove directories
  if (config.directories) {
    for (const entry of config.directories) {
      try {
        const targetPath = join(workspaceRoot, entry.target.startsWith('@') ? entry.target.slice(1) : entry.target)
        try {
          const stats = statFile(workspaceRoot, entry.target.startsWith('@') ? entry.target.slice(1) : entry.target)
          if (stats.isSymbolicLink()) {
            await removeSymlink(targetPath)
            log(`Removed symlink directory: ${entry.target}`)
            success++
          } else {
            log(`Skipped real directory: ${entry.target}`)
          }
        } catch {
          // File doesn't exist, nothing to remove
        }
      } catch (error) {
        const errorMsg = `Failed to remove directory ${entry.target}: ${error}`
        errors.push(errorMsg)
        log(`ERROR: ${errorMsg}`)
        failed++
      }
    }
  }

  // Remove files
  if (config.files) {
    for (const entry of config.files) {
      try {
        const targetPath = join(workspaceRoot, entry.target.startsWith('@') ? entry.target.slice(1) : entry.target)
        try {
          const stats = statFile(workspaceRoot, entry.target.startsWith('@') ? entry.target.slice(1) : entry.target)
          if (stats.isSymbolicLink()) {
            await removeSymlink(targetPath)
            log(`Removed symlink file: ${entry.target}`)
            success++
          } else {
            log(`Skipped real file: ${entry.target}`)
          }
        } catch {
          // File doesn't exist, nothing to remove
        }
      } catch (error) {
        const errorMsg = `Failed to remove file ${entry.target}: ${error}`
        errors.push(errorMsg)
        log(`ERROR: ${errorMsg}`)
        failed++
      }
    }
  }

  return { success, failed, errors }
}
