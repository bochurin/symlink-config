import * as path from 'path'
import { read as readSymlinkSettings } from '../../managers/symlink-settings'
import { FILE_NAMES, CONFIG_PARAMETERS } from '../../shared/constants'
import { SymlinkOperation } from './types'
import { writeFile } from '../../shared/file-ops'

export async function generateApplyWindowsScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
) {
  const scriptPath = path.join(workspaceRoot, FILE_NAMES.APPLY_SYMLINKS_BAT)

  const lines = ['@echo off', 'echo Applying symlink configuration...', '']

  for (const op of operations) {
    const targetPath = path.join(workspaceRoot, op.target)
    const targetDir = path.dirname(targetPath)

    if (op.type === 'delete') {
      lines.push(`if exist "${targetPath}" (`)
      lines.push(`  echo Removing ${op.target}`)
      lines.push(`  rmdir "${targetPath}" 2>nul || del "${targetPath}" 2>nul`)
      lines.push(')')
    } else if (op.type === 'create' && op.source) {
      // Get path mode setting
      const pathMode = readSymlinkSettings(CONFIG_PARAMETERS.SYMLINK_PATH_MODE)

      let sourcePath: string
      let symlinkSource: string

      if (pathMode === 'absolute') {
        sourcePath = op.source.startsWith('@')
          ? path.join(workspaceRoot, op.source.slice(1))
          : path.join(workspaceRoot, op.source)
        symlinkSource = sourcePath
      } else {
        // Relative mode - calculate relative path from target to source
        sourcePath = op.source.startsWith('@')
          ? path.join(workspaceRoot, op.source.slice(1))
          : path.join(workspaceRoot, op.source)
        symlinkSource = path.relative(path.dirname(targetPath), sourcePath)
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

  const content = lines.join('\r\n')
  const relativePath = path.relative(workspaceRoot, scriptPath)
  await writeFile(relativePath, content)
}
