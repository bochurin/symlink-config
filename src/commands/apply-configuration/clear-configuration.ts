import * as vscode from 'vscode'
import * as os from 'os'
import * as path from 'path'

import { generateClearWindowsScript } from './generate-clear-windows-script'
import { generateClearUnixScript } from './generate-clear-unix-script'
import { getWorkspaceRoot } from '../../state'
import { confirmWarning } from '../../shared/vscode'
import { FILE_NAMES } from '../../shared/constants'
import { generateAdminScript } from './generate-admin-script'

export async function clearConfiguration(): Promise<void> {
  const workspaceRoot = getWorkspaceRoot()
  if (!workspaceRoot) {
    vscode.window.showErrorMessage('No workspace folder found')
    return
  }

  // Confirmation dialog for script generation
  const confirmed = await confirmWarning(
    'Generate script to remove all symlinks defined in current.symlink.config.json?',
    'Yes, Generate Clear Script',
  )

  if (!confirmed) {
    return
  }

  const isWindows = os.platform() === 'win32'

  try {
    if (isWindows) {
      await generateClearWindowsScript(workspaceRoot)
      await generateAdminScript(workspaceRoot)
      const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAR_SYMLINKS_BAT)

      // Copy script name to clipboard
      await vscode.env.clipboard.writeText(path.basename(scriptPath))

      // Show options to user
      const options = ['Open in Code', 'Run as Admin']
      const choice = await vscode.window.showWarningMessage(
        `Clear script generated: ${path.basename(scriptPath)}`,
        { modal: true },
        ...options,
      )

      if (choice === 'Open in Code') {
        const document = await vscode.workspace.openTextDocument(scriptPath)
        await vscode.window.showTextDocument(document)
      } else if (choice === 'Run as Admin') {
        const adminBatPath = path.join(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT)
        const clearBatPath = path.join(workspaceRoot, FILE_NAMES.CLEAR_SYMLINKS_BAT)
        const terminal = vscode.window.createTerminal({ name: 'Run as Admin', cwd: workspaceRoot })
        terminal.sendText(`"${adminBatPath}" "${clearBatPath}"`)
        terminal.show()
      }
    } else {
      await generateClearUnixScript(workspaceRoot)
      const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAR_SYMLINKS_SH)

      // Show options to user
      const options = ['Open in Code', 'Run Now']
      const choice = await vscode.window.showWarningMessage(
        `Clear script generated: ${path.basename(scriptPath)}`,
        { modal: true },
        ...options,
      )

      if (choice === 'Open in Code') {
        const document = await vscode.workspace.openTextDocument(scriptPath)
        await vscode.window.showTextDocument(document)
      } else if (choice === 'Run Now') {
        const terminal = vscode.window.createTerminal('Clear Symlinks')
        terminal.show()
        terminal.sendText(
          `cd "${workspaceRoot}" && chmod +x "${path.basename(scriptPath)}" && "./${path.basename(scriptPath)}"`,
        )
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to generate clear script: ${error}`)
  }
}
