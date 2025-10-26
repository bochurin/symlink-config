import * as fs from 'fs'
import * as path from 'path'
import { log } from '@log'
import { SymlinkOperation } from '../utils'

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
        const targetPath = path.join(workspaceRoot, op.target)
        if (fs.existsSync(targetPath)) {
          const stats = fs.lstatSync(targetPath)
          if (stats.isSymbolicLink()) {
            fs.unlinkSync(targetPath)
            log(`Removed symlink: ${op.target}`)
            success++
          } else {
            log(`Skipped non-symlink: ${op.target}`)
          }
        }
      } else if (op.type === 'create' && op.source) {
        const targetPath = path.join(workspaceRoot, op.target)
        const sourcePath = path.join(workspaceRoot, op.source.startsWith('@') ? op.source.slice(1) : op.source)
        
        // Create target directory if needed
        const targetDir = path.dirname(targetPath)
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true })
        }

        // Check if source exists
        if (!fs.existsSync(sourcePath)) {
          const error = `Source not found: ${sourcePath}`
          errors.push(error)
          log(`ERROR: ${error}`)
          failed++
          continue
        }

        // Remove existing target if it exists
        if (fs.existsSync(targetPath)) {
          const stats = fs.lstatSync(targetPath)
          if (stats.isSymbolicLink()) {
            fs.unlinkSync(targetPath)
            log(`Removed existing symlink: ${op.target}`)
          } else {
            const error = `Target exists and is not a symlink: ${targetPath}`
            errors.push(error)
            log(`ERROR: ${error}`)
            failed++
            continue
          }
        }

        // Create real symbolic link
        const linkType = op.isDirectory ? 'dir' : 'file'
        fs.symlinkSync(sourcePath, targetPath, linkType)
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
