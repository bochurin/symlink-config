import * as vscode from 'vscode'
import * as os from 'os'
import * as path from 'path'

import { generateCleanWindowsScript } from './generate-clean-windows-script'
import { generateCleanUnixScript } from './generate-clean-unix-script'
import { getWorkspaceRoot } from '@state'
import { log } from '@shared/log'
import { confirmWarning } from '@shared/vscode'
import { FILE_NAMES, SETTINGS } from '@shared/constants'
import { generateAdminScript } from './generate-admin-script'
import { runScriptAsAdmin } from '@shared/script-runner'
import { useSymlinkConfigManager } from '@managers'
import { removeSymlinksDirectly } from './direct-symlink-remover'

export async function cleanConfig(): Promise<void> {
  const workspaceRoot = getWorkspaceRoot()
  if (!workspaceRoot) {
    log('ERROR: No workspace folder found')
    vscode.window.showErrorMessage('No workspace folder found')
    return
  }

  const settingsManager = useSymlinkConfigManager()
  const scriptGenerationMode = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION_MODE,
  )

  // Offer direct removal or script generation
  const choice = await vscode.window.showWarningMessage(
    'Remove symlinks handled by the extension?',
    { modal: true },
    'Remove Directly',
    'Generate Script'
  )
  
  if (!choice) {
    log('Clean configuration cancelled by user')
    return
  }
  
  if (choice === 'Remove Directly') {
    log('Removing symlinks directly...')
    const result = await removeSymlinksDirectly(workspaceRoot)
    
    if (result.errors.length > 0) {
      vscode.window.showWarningMessage(
        `Symlinks removed with ${result.failed} errors. Check output for details.`
      )
    } else if (result.success > 0) {
      vscode.window.showInformationMessage(`Successfully removed ${result.success} symlinks`)
    } else {
      vscode.window.showInformationMessage('No symlinks found to remove')
    }
    log(`Direct removal complete: ${result.success} success, ${result.failed} failed`)
    return
  }

  log('Generating clean configuration scripts (user chose scripts over direct removal)...')

  const isWindows = os.platform() === 'win32'

  try {
    if (isWindows) {
      log('Generating Windows clean script...')
      await generateCleanWindowsScript(workspaceRoot)
      await generateAdminScript(workspaceRoot)
      log('Windows clean script generated')
      const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAN_SYMLINKS_BAT)

      // Copy script name to clipboard
      await vscode.env.clipboard.writeText(path.basename(scriptPath))

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
        runScriptAsAdmin(scriptPath, workspaceRoot)
      }
    } else {
      log('Generating Unix clean script...')
      await generateCleanUnixScript(workspaceRoot)
      log('Unix clean script generated')
      const scriptPath = path.join(workspaceRoot, FILE_NAMES.CLEAN_SYMLINKS_SH)

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
        runScriptAsAdmin(scriptPath, workspaceRoot)
      }
    }
  } catch (error) {
    log(`ERROR: Failed to generate cleaning script: ${error}`)
    vscode.window.showErrorMessage(
      `Failed to generate cleaning script: ${error}`,
    )
  }
}
