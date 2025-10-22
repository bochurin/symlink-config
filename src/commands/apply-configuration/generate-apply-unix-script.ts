import * as path from 'path'
import { useSymlinkConfigManager } from '@/src/managers'
import { FILE_NAMES, SETTINGS } from '@shared/constants'
import { SymlinkOperation } from './types'
import { writeFile } from '@shared/file-ops'

export async function generateApplyUnixScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
) {
  const settingsManager = useSymlinkConfigManager()

  const scriptPath = path.join(workspaceRoot, FILE_NAMES.APPLY_SYMLINKS_SH)

  const lines = ['#!/bin/bash', 'echo "Applying symlink configuration..."', '']

  for (const op of operations) {
    const targetPath = path.join(workspaceRoot, op.target)
    const targetDir = path.dirname(targetPath)

    if (op.type === 'delete') {
      lines.push(`if [ -e "${targetPath}" ]; then`)
      lines.push(`  echo "Removing ${op.target}"`)
      lines.push(`  rm -rf "${targetPath}"`)
      lines.push('fi')
    } else if (op.type === 'create' && op.source) {
      // Get path mode setting
      const pathMode = settingsManager.read(
        SETTINGS.SYMLINK_CONFIG.SYMLINK_PATH_MODE,
      )

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
      lines.push(`if [ ! -d "${targetDir}" ]; then`)
      lines.push(`  echo "Creating directory ${targetDir}"`)
      lines.push(`  mkdir -p "${targetDir}"`)
      lines.push('fi')

      // Check if source exists before creating symlink
      lines.push(`if [ -e "${sourcePath}" ]; then`)
      lines.push(`  echo "Creating ${op.target} -> ${op.source}"`)
      lines.push(`  ln -sf "${symlinkSource}" "${targetPath}"`)
      lines.push('else')
      lines.push(`  echo "ERROR: Source not found: ${sourcePath}"`)
      lines.push('fi')
    }
  }

  lines.push('')
  lines.push('echo "Done!"')

  const content = lines.join('\n')
  const relativePath = path.relative(workspaceRoot, scriptPath)
  await writeFile(workspaceRoot, relativePath, content, 0o755)
}
