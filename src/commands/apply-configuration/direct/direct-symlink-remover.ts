import * as fs from 'fs'
import * as path from 'path'
import { log } from '@log'
import { useCurrentSymlinkConfigManager } from '@managers'

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
        const targetPath = path.join(workspaceRoot, entry.target.startsWith('@') ? entry.target.slice(1) : entry.target)
        if (fs.existsSync(targetPath)) {
          const stats = fs.lstatSync(targetPath)
          if (stats.isSymbolicLink()) {
            fs.unlinkSync(targetPath)
            log(`Removed symlink directory: ${entry.target}`)
            success++
          } else {
            log(`Skipped real directory: ${entry.target}`)
          }
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
        const targetPath = path.join(workspaceRoot, entry.target.startsWith('@') ? entry.target.slice(1) : entry.target)
        if (fs.existsSync(targetPath)) {
          const stats = fs.lstatSync(targetPath)
          if (stats.isSymbolicLink()) {
            fs.unlinkSync(targetPath)
            log(`Removed symlink file: ${entry.target}`)
            success++
          } else {
            log(`Skipped real file: ${entry.target}`)
          }
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
