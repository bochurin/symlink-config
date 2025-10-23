import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import * as vscode from 'vscode'
import { log } from '@shared/log'
import { SymlinkOperation } from '@commands/apply-configuration/types'

export async function createSymlinksDirectly(
  operations: SymlinkOperation[],
  workspaceRoot: string,
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  let failed = 0
  const errors: string[] = []
  
  // Check for dangerous VSCode/workspace symlinks
  const dangerousOps = operations.filter(op => {
    if (op.type !== 'create' || !op.source) return false
    const source = op.source.toLowerCase()
    return source.includes('.vscode/') || source.includes('.vscode\\') || 
           source.endsWith('.code-workspace') || source.includes('workspace')
  })
  
  let safeOperations = operations
  if (dangerousOps.length > 0) {
    const dangerousList = dangerousOps.map(op => `${op.target} -> ${op.source}`).join('\n')
    const confirmed = await vscode.window.showWarningMessage(
      `WARNING: The following symlinks target VSCode configuration files that may cause workspace corruption:\n\n${dangerousList}\n\nInclude these dangerous symlinks?`,
      { modal: true },
      'Skip Dangerous Symlinks',
      'Include Anyway'
    )
    
    if (confirmed === 'Skip Dangerous Symlinks') {
      safeOperations = operations.filter(op => !dangerousOps.includes(op))
      log(`Skipped ${dangerousOps.length} dangerous symlinks`)
    }
  }

  for (const op of safeOperations) {
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

        // Skip if target already exists (incremental mode)
        if (fs.existsSync(targetPath)) {
          log(`Skipped existing: ${op.target}`)
          continue
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