import * as vscode from 'vscode'
import * as os from 'os'
import * as path from 'path'

import { generateCleanWindowsScript } from './generate-clean-windows-script'
import { generateCleanUnixScript } from './generate-clean-unix-script'
import { getWorkspaceRoot } from '../../shared/state'
import { confirmWarning } from '../../shared/vscode'
import { FILE_NAMES } from '../../shared/constants'
import { generateAdminScript } from './generate-admin-script'

export async function cleanConfig(): Promise<void> {
  const { log } = await import('../../shared/state')
  const workspaceRoot = getWorkspaceRoot()
  if (!workspaceRoot) {
    log('ERROR: No workspace folder found')
    vscode.window.showErrorMessage('No workspace folder found')
    return
  }

  // Confirmation dialog for script generation
  const confirmed = await confirmWarning(
    'Generate cleaning script to remove all symlinks hadled by the extesion?',
    'Yes, Generate Cleaning Script',
  )

  if (!confirmed) {
    log('Clean configuration cancelled by user')
    return
  }
  
  log('Generating clean configuration scripts...')

  const isWindows = os.platform() === 'win32'

  try {
    if (isWindows) {
      log('Generating Windows clean script...')
      await generateCleanWindowsScript(workspaceRoot)
      await generateAdminScript(workspaceRoot)
      log('Windows clean script generated')
      const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAR_SYMLINKS_BAT)

      // Copy script name to clipboard
      await vscode.env.clipboard.writeText(path.basename(scriptPath))

      // Show options to user
      const options = ['Open in Code', 'Run as Admin']
      const choice = await vscode.window.showWarningMessage(
        `Cleaning script generated: ${path.basename(scriptPath)}`,
        { modal: true },
        ...options,
      )

      if (choice === 'Open in Code') {
        const document = await vscode.workspace.openTextDocument(scriptPath)
        await vscode.window.showTextDocument(document)
      } else if (choice === 'Run as Admin') {
        const adminBatPath = path.join(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT)
        const clearBatPath = path.join(
          workspaceRoot,
          FILE_NAMES.CLEAR_SYMLINKS_BAT,
        )
        const terminal = vscode.window.createTerminal({
          name: 'Run as Admin',
          cwd: workspaceRoot,
        })
        terminal.sendText(`"${adminBatPath}" "${clearBatPath}"`)
        terminal.show()
      }
    } else {
      log('Generating Unix clean script...')
      await generateCleanUnixScript(workspaceRoot)
      log('Unix clean script generated')
      const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAR_SYMLINKS_SH)

      // Show options to user
      const options = ['Open in Code', 'Run Now']
      const choice = await vscode.window.showWarningMessage(
        `Cleaning script generated: ${path.basename(scriptPath)}`,
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
    log(`ERROR: Failed to generate cleaning script: ${error}`)
    vscode.window.showErrorMessage(
      `Failed to generate cleaning script: ${error}`,
    )
  }
}
