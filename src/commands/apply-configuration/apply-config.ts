import * as vscode from 'vscode'
import * as os from 'os'
import * as path from 'path'
import { getWorkspaceRoot } from '../../extension/state'
import { log } from '../../shared/log'
import { info } from '../../shared/vscode/info'
import { generateTree } from '../../views/symlink-tree/generate'
import { collectSymlinkOperations } from './collect-operations'
import { generateApplyWindowsScript } from './generate-apply-windows-script'
import { generateApplyUnixScript } from './generate-apply-unix-script'
import { read as readSymlinkSettings } from '../../managers/symlink-settings'
import { SETTINGS, FILE_NAMES } from '../../shared/constants'
import { confirm } from '../../shared/vscode'
import { generateAdminScript } from './generate-admin-script'

export async function applyConfig() {
  const workspaceRoot = getWorkspaceRoot()

  // Confirmation dialog
  const confirmed = await confirm(
    'Generate symlink scripts to apply configuration?',
    'Yes, Generate Applying Scripts',
  )

  if (!confirmed) {
    log('Apply configuration cancelled by user')
    return
  }

  try {
    log('Generating apply configuration scripts...')
    // Generate tree to get symlink operations
    const tree = generateTree('targets')
    const operations = collectSymlinkOperations(tree)
    log(`Found ${operations.length} symlink operations`)

    if (operations.length === 0) {
      log('No symlink operations needed')
      info('No symlink operations needed')
      return
    }

    const scriptGeneration = readSymlinkSettings(
      SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION,
    )
    const isWindows = os.platform() === 'win32'

    const shouldGenerateWindows =
      scriptGeneration === 'windows-only' ||
      scriptGeneration === 'both' ||
      (scriptGeneration === 'auto' && isWindows)
    const shouldGenerateUnix =
      scriptGeneration === 'unix-only' ||
      scriptGeneration === 'both' ||
      (scriptGeneration === 'auto' && !isWindows)

    if (shouldGenerateWindows) {
      log('Generating Windows apply script...')
      await generateApplyWindowsScript(operations, workspaceRoot)
      await generateAdminScript(workspaceRoot)
      log('Windows apply script generated')
      const scriptPath = path.join(workspaceRoot, FILE_NAMES.APPLY_SYMLINKS_BAT)

      await vscode.env.clipboard.writeText(path.basename(scriptPath))

      const options = ['Open in Code', 'Run as Admin']
      const choice = await vscode.window.showInformationMessage(
        `Applying script generated: ${path.basename(scriptPath)}`,
        { modal: true },
        ...options,
      )

      if (choice === 'Open in Code') {
        const document = await vscode.workspace.openTextDocument(scriptPath)
        await vscode.window.showTextDocument(document)
      } else if (choice === 'Run as Admin') {
        const adminBatPath = path.join(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT)
        const applyBatPath = path.join(
          workspaceRoot,
          FILE_NAMES.APPLY_SYMLINKS_BAT,
        )
        const terminal = vscode.window.createTerminal({
          name: 'Run as Admin',
          cwd: workspaceRoot,
        })
        terminal.sendText(`"${adminBatPath}" "${applyBatPath}"`)
        terminal.show()
      }
    }

    if (shouldGenerateUnix) {
      log('Generating Unix apply script...')
      await generateApplyUnixScript(operations, workspaceRoot)
      log('Unix apply script generated')
      const scriptPath = path.join(workspaceRoot, FILE_NAMES.APPLY_SYMLINKS_SH)

      const options = ['Open in Code', 'Run Now']
      const choice = await vscode.window.showInformationMessage(
        `Applying script generated: ${path.basename(scriptPath)}`,
        { modal: true },
        ...options,
      )

      if (choice === 'Open in Code') {
        const document = await vscode.workspace.openTextDocument(scriptPath)
        await vscode.window.showTextDocument(document)
      } else if (choice === 'Run Now') {
        const terminal = vscode.window.createTerminal('Apply Symlinks')
        terminal.show()
        terminal.sendText(
          `cd "${workspaceRoot}" && chmod +x "${path.basename(scriptPath)}" && "./${path.basename(scriptPath)}"`,
        )
      }
    }
  } catch (error) {
    log(`ERROR: Failed to apply configuration: ${error}`)
    vscode.window.showErrorMessage(`Failed to apply configuration: ${error}`)
  }
}
