import * as path from 'path'
import { FILE_NAMES } from '@shared/constants'
import { writeFile } from '@shared/file-ops'
import { useCurrentSymlinkConfigManager } from '@/src/managers'

export async function generateCleanWindowsScript(workspaceRoot: string) {
  const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAN_SYMLINKS_BAT)

  const currentConfigManager = useCurrentSymlinkConfigManager()
  const currentConfig = currentConfigManager.read()

  if (!currentConfig) {
    return
  }

  const config = JSON.parse(currentConfig)
  const lines = [
    '@echo off',
    `cd /d "${workspaceRoot.replace(/\//g, '\\')}"`,
    'echo Clearing symlinks...',
    ''
  ]

  // Remove directories (only if they are symlinks)
  if (config.directories) {
    for (const entry of config.directories) {
      const targetPath = (entry.target.startsWith('@') ? entry.target.slice(1) : entry.target).replace(/\//g, '\\')
      lines.push(`if exist "${targetPath}" (`)
      lines.push(`  fsutil reparsepoint query "${targetPath}" >nul 2>&1`)
      lines.push(`  if not errorlevel 1 (`)
      lines.push(`    echo Removing symlink directory ${targetPath}`)
      lines.push(`    rmdir "${targetPath}"`)
      lines.push(`  ) else (`)
      lines.push(`    echo Skipping real directory ${targetPath}`)
      lines.push(`  )`)
      lines.push(')')
    }
  }

  // Remove files (only if they are symlinks)
  if (config.files) {
    for (const entry of config.files) {
      const targetPath = (entry.target.startsWith('@') ? entry.target.slice(1) : entry.target).replace(/\//g, '\\')
      lines.push(`if exist "${targetPath}" (`)
      lines.push(`  fsutil reparsepoint query "${targetPath}" >nul 2>&1`)
      lines.push(`  if not errorlevel 1 (`)
      lines.push(`    echo Removing symlink file ${targetPath}`)
      lines.push(`    del "${targetPath}"`)
      lines.push(`  ) else (`)
      lines.push(`    echo Skipping real file ${targetPath}`)
      lines.push(`  )`)
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
