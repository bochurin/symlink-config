import * as path from 'path'
import { FILE_NAMES } from '@shared/constants'
import { read as readCurrentConfig } from '@managers/current-config'
import { writeFile } from '@shared/file-ops'

export async function generateCleanUnixScript(workspaceRoot: string) {
  const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAR_SYMLINKS_SH)
  const currentConfig = readCurrentConfig()

  if (!currentConfig) {
    return
  }

  const config = JSON.parse(currentConfig)
  const lines = ['#!/bin/bash', 'echo "Clearing symlinks..."', '']

  // Remove directories and files
  const allEntries = [...(config.directories || []), ...(config.files || [])]

  for (const entry of allEntries) {
    const targetPath = path.join(workspaceRoot, entry.target)
    lines.push(`if [ -e "${targetPath}" ]; then`)
    lines.push(`  echo "Removing ${entry.target}"`)
    lines.push(`  rm -rf "${targetPath}"`)
    lines.push('fi')
  }

  lines.push('')
  lines.push('echo "Done!"')

  const content = lines.join('\n')
  const relativePath = path.relative(workspaceRoot, scriptPath)
  await writeFile(workspaceRoot, relativePath, content, 0o755)
}
