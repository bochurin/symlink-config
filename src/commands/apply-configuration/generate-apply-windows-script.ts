import * as vscode from 'vscode'
import * as path from 'path'
import { useSymlinkConfigManager } from '@/src/managers'
import { FILE_NAMES, SETTINGS } from '@shared/constants'
import { SymlinkOperation } from './types'
import { writeFile } from '@shared/file-ops'

export async function generateApplyWindowsScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
) {
  // Check for dangerous VSCode/workspace files
  const dangerousOps = operations.filter(op => {
    if (op.type !== 'create' || !op.source) return false
    const source = op.source.toLowerCase()
    return source.includes('.vscode/') || source.includes('.vscode\\') || 
           source.endsWith('.code-workspace') || source.includes('workspace')
  })
  
  if (dangerousOps.length > 0) {
    const dangerousList = dangerousOps.map(op => `${op.target} -> ${op.source}`).join('\n')
    const confirmed = await vscode.window.showWarningMessage(
      `WARNING: The following symlinks target VSCode configuration files that may cause workspace corruption:\n\n${dangerousList}\n\nInclude these dangerous symlinks in the script?`,
      { modal: true },
      'Skip Dangerous Symlinks',
      'Include Anyway'
    )
    
    if (confirmed === 'Skip Dangerous Symlinks') {
      operations = operations.filter(op => !dangerousOps.includes(op))
    }
  }

  const settingsManager = useSymlinkConfigManager()

  const scriptPath = path.join(workspaceRoot, FILE_NAMES.APPLY_SYMLINKS_BAT)

  const lines = [
    '@echo off',
    `cd /d "${workspaceRoot.replace(/\//g, '\\')}"`,
    'echo Applying symlink configuration...',
    ''
  ]

  for (const op of operations) {
    const targetPath = op.target.replace(/\//g, '\\')
    const targetDir = path.dirname(op.target).replace(/\//g, '\\')

    if (op.type === 'delete') {
      lines.push(`if exist "${targetPath}" (`)
      lines.push(`  echo Removing ${op.target}`)
      lines.push(`  rmdir "${targetPath}" 2>nul || del "${targetPath}" 2>nul`)
      lines.push(')')
    } else if (op.type === 'create' && op.source) {
      // Get path mode setting
      const pathMode = settingsManager.read(
        SETTINGS.SYMLINK_CONFIG.SYMLINK_PATH_MODE,
      )

      let sourcePath: string
      let symlinkSource: string

      // Always use relative paths from workspace root for source check
      sourcePath = (op.source.startsWith('@') ? op.source.slice(1) : op.source).replace(/\//g, '\\')
      
      if (pathMode === 'absolute') {
        // For absolute mode, use full path for mklink source
        const fullSourcePath = path.join(workspaceRoot, op.source.startsWith('@') ? op.source.slice(1) : op.source)
        symlinkSource = fullSourcePath.replace(/\//g, '\\')
      } else {
        // For relative mode, calculate relative path from target to source
        const fullTargetPath = path.join(workspaceRoot, op.target)
        const fullSourcePath = path.join(workspaceRoot, op.source.startsWith('@') ? op.source.slice(1) : op.source)
        symlinkSource = path.relative(path.dirname(fullTargetPath), fullSourcePath).replace(/\//g, '\\')
      }

      // Create target directory if it doesn't exist
      lines.push(`if not exist "${targetDir}" (`)
      lines.push(`  echo Creating directory ${targetDir}`)
      lines.push(`  mkdir "${targetDir}"`)
      lines.push(')')

      // Check if source exists before creating symlink
      lines.push(`if exist "${sourcePath}" (`)
      const linkType = op.isDirectory ? '/D' : ''
      lines.push(`  echo Creating ${op.target} -> ${op.source}`)
      lines.push(`  mklink ${linkType} "${targetPath}" "${symlinkSource}"`)
      lines.push(') else (')
      lines.push(`  echo ERROR: Source not found: ${sourcePath}`)
      lines.push(')')
    }
  }

  lines.push('')
  lines.push('echo Done!')
  lines.push('')

  const content = lines.join('\r\n')
  const relativePath = path.relative(workspaceRoot, scriptPath)
  await writeFile(workspaceRoot, relativePath, content)
}
