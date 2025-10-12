import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'
import { info } from '../../shared/vscode/info'
import { read as readSymlinkSettings } from '../../managers/symlink-settings'
import { FILE_NAMES, CONFIG_PARAMETERS } from '../../shared/constants'
import { SymlinkOperation } from './types'

export async function generateUnixScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
) {
  const scriptPath = path.join(workspaceRoot, FILE_NAMES.APPLY_SYMLINKS_SH)

  const lines = [
    '#!/bin/bash',
    'echo "Applying symlink configuration..."',
    ''
  ]

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

  // Copy next config to current config
  const nextConfigPath = path.join(workspaceRoot, FILE_NAMES.NEXT_SYMLINK_CONFIG)
  const currentConfigPath = path.join(workspaceRoot, FILE_NAMES.CURRENT_SYMLINK_CONFIG)
  lines.push('')
  lines.push('echo "Updating configuration..."')
  lines.push(`cp "${nextConfigPath}" "${currentConfigPath}"`)
  lines.push('')
  lines.push('echo "Done!"')

  const content = lines.join('\n')
  await fs.writeFile(scriptPath, content, { encoding: 'utf8', mode: 0o755 })

  // Show Unix instructions
  info(`Unix script generated: ${path.basename(scriptPath)}`)

  // Show options to user
  const isUnix = os.platform() !== 'win32'
  const options = ['Open in Code']
  if (isUnix) {
    options.push('Run Now')
  }
  
  const choice = await vscode.window.showInformationMessage(
    `Unix script generated: ${path.basename(scriptPath)}`,
    { modal: true },
    ...options
  )

  if (choice === 'Open in Code') {
    const document = await vscode.workspace.openTextDocument(scriptPath)
    await vscode.window.showTextDocument(document)
  } else if (choice === 'Run Now') {
    // Execute the script
    const { spawn } = require('child_process')
    const child = spawn('bash', [scriptPath], { 
      cwd: workspaceRoot,
      stdio: 'pipe'
    })
    
    let output = ''
    child.stdout.on('data', (data: Buffer) => {
      output += data.toString()
    })
    
    child.stderr.on('data', (data: Buffer) => {
      output += data.toString()
    })
    
    child.on('close', (code: number | null) => {
      if (code === 0) {
        info('Configuration applied successfully')
      } else {
        vscode.window.showErrorMessage(`Script failed with code ${code}`)
      }
      console.log('Script output:', output)
    })
  }
}