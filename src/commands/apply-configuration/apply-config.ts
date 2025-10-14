import * as vscode from 'vscode'
import * as os from 'os'
import * as path from 'path'
import { getWorkspaceRoot } from '../../shared/state'
import { info } from '../../shared/vscode/info'
import { generateTree } from '../../views/symlink-tree/generate'
import { collectSymlinkOperations } from './collect-operations'
import { generateApplyWindowsScript } from './generate-apply-windows-script'
import { generateApplyUnixScript } from './generate-apply-unix-script'
import { read as readSymlinkSettings } from '../../managers/symlink-settings'
import { CONFIG, FILE_NAMES } from '../../shared/constants'
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
    return
  }

  try {
    // Generate tree to get symlink operations
    const tree = generateTree('targets')
    const operations = collectSymlinkOperations(tree)

    if (operations.length === 0) {
      info('No symlink operations needed')
      return
    }

    const scriptGeneration = readSymlinkSettings(
      CONFIG.SYMLINK_CONFIG.SCRIPT_GENERATION,
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
      await generateApplyWindowsScript(operations, workspaceRoot)
      await generateAdminScript(workspaceRoot)
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
      await generateApplyUnixScript(operations, workspaceRoot)
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
    vscode.window.showErrorMessage(`Failed to apply configuration: ${error}`)
  }
}
