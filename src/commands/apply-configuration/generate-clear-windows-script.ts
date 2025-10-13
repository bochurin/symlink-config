import * as path from 'path'
import { FILE_NAMES } from '../../shared/constants'
import { read as readCurrentConfig } from '../../managers/current-config'
import { writeFile } from '../../shared/file-ops'

export async function generateClearWindowsScript(workspaceRoot: string) {
  const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAR_SYMLINKS_BAT)
  const currentConfig = readCurrentConfig()
  
  if (!currentConfig) {
    return
  }

  const config = JSON.parse(currentConfig)
  const lines = [
    '@echo off',
    'echo Clearing symlinks...',
    ''
  ]

  // Remove directories
  if (config.directories) {
    for (const entry of config.directories) {
      const targetPath = path.join(workspaceRoot, entry.target)
      lines.push(`if exist "${targetPath}" (`)
      lines.push(`  echo Removing ${entry.target}`)
      lines.push(`  rmdir "${targetPath}"`)
      lines.push(')') 
    }
  }

  // Remove files
  if (config.files) {
    for (const entry of config.files) {
      const targetPath = path.join(workspaceRoot, entry.target)
      lines.push(`if exist "${targetPath}" (`)
      lines.push(`  echo Removing ${entry.target}`)
      lines.push(`  del "${targetPath}"`)
      lines.push(')')
    }
  }

  lines.push('')
  lines.push('echo Done!')

  const content = lines.join('\r\n')
  const relativePath = path.relative(workspaceRoot, scriptPath)
  await writeFile(relativePath, content)
}