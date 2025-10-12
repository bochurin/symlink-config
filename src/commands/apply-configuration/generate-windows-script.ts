import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'
import { warning } from '../../shared/vscode/warning'
import { read as readSymlinkSettings } from '../../managers/symlink-settings'
import { FILE_NAMES, CONFIG_PARAMETERS } from '../../shared/constants'
import { SymlinkOperation } from './types'

export async function generateWindowsScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
) {
  const scriptPath = path.join(workspaceRoot, FILE_NAMES.APPLY_SYMLINKS_BAT)

  const lines = [
    '@echo off',
    'echo Applying symlink configuration...',
    ''
  ]

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

  // Copy next config to current config
  const nextConfigPath = path.join(workspaceRoot, FILE_NAMES.NEXT_SYMLINK_CONFIG)
  const currentConfigPath = path.join(workspaceRoot, FILE_NAMES.CURRENT_SYMLINK_CONFIG)
  lines.push('')
  lines.push('echo Updating configuration...')
  lines.push(`copy "${nextConfigPath}" "${currentConfigPath}" >nul`)

  lines.push('')
  lines.push('echo Done!')

  const content = lines.join('\r\n')
  await fs.writeFile(scriptPath, content, { encoding: 'utf8' })

  // Copy script name to clipboard
  await vscode.env.clipboard.writeText(path.basename(scriptPath))

  // Show Windows instructions
  warning(`Run as Administrator: ${path.basename(scriptPath)} (copied to clipboard)`)

  // Show options to user
  const isWindows = os.platform() === 'win32'
  const options = ['Open in Code']
  if (isWindows) {
    options.push('Run as Admin')
  }
  
  const choice = await vscode.window.showInformationMessage(
    `Windows script generated: ${path.basename(scriptPath)}`,
    { modal: true },
    ...options
  )

  if (choice === 'Open in Code') {
    const document = await vscode.workspace.openTextDocument(scriptPath)
    await vscode.window.showTextDocument(document)
  } else if (choice === 'Run as Admin') {
    // Create PowerShell command to run as admin
    const psCommand = `powershell -Command "Start-Process cmd -ArgumentList '/k \"${scriptPath}\"' -Verb RunAs"`
    
    // Write to temp batch file and execute
    const tempBat = path.join(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT)
    await fs.writeFile(tempBat, psCommand)
    
    vscode.env.openExternal(vscode.Uri.file(tempBat))
  }
}