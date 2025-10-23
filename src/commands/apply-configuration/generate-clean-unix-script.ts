import * as path from 'path'
import { FILE_NAMES, SETTINGS } from '@shared/constants'
import { writeFile } from '@shared/file-ops'
import { useCurrentSymlinkConfigManager, useSymlinkConfigManager } from '@/src/managers'

export async function generateCleanUnixScript(workspaceRoot: string) {
  const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAN_SYMLINKS_SH)

  const currentConfigManager = useCurrentSymlinkConfigManager()
  const currentConfig = currentConfigManager.read()
  const settingsManager = useSymlinkConfigManager()
  const scriptGenerationMode = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION_MODE,
  )

  if (!currentConfig) {
    return
  }

  const config = JSON.parse(currentConfig)
  const lines = ['#!/bin/bash', 'echo "Clearing symlinks..."', '']

  // Remove directories and files
  const allEntries = [...(config.directories || []), ...(config.files || [])]

  for (const entry of allEntries) {
    const targetPath = path.join(workspaceRoot, entry.target)
    if (String(scriptGenerationMode) === 'complete') {
      lines.push(`if [ -e "${targetPath}" ]; then`)
      lines.push(`  if [ -L "${targetPath}" ]; then`)
      lines.push(`    echo "Removing symlink ${entry.target}"`)
      lines.push(`    rm -rf "${targetPath}"`)
      lines.push(`  else`)
      lines.push(`    echo "Skipping real file/directory ${entry.target}"`)
      lines.push(`  fi`)
      lines.push('fi')
    } else {
      lines.push(`if [ -L "${targetPath}" ]; then`)
      lines.push(`  echo "Removing symlink ${entry.target}"`)
      lines.push(`  rm -rf "${targetPath}"`)
      lines.push('fi')
    }
  }

  lines.push('')
  lines.push('echo "Done!"')

  const content = lines.join('\n')
  const relativePath = path.relative(workspaceRoot, scriptPath)
  await writeFile(workspaceRoot, relativePath, content, 0o755)
}
