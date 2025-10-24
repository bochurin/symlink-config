import * as vscode from 'vscode'
import * as os from 'os'
import * as path from 'path'

import { cleanScript, generateAdminScript } from './scripts'
import { removeSymlinksDirectly } from './direct'
import { getWorkspaceRoot } from '@state'
import { log } from '@log'
import { confirmWarning } from '@shared/vscode'
import { FILE_NAMES, SETTINGS } from '@shared/constants'
import { runScriptAsAdmin } from '@shared/script-runner'
import { useSymlinkConfigManager } from '@managers'

export async function cleanConfig(silent = false): Promise<void> {
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
  let choice: string | undefined

  if (silent) {
    choice = 'Remove Directly'
  } else {
    choice = await vscode.window.showWarningMessage(
      'Remove symlinks handled by the extension?',
      { modal: true },
      'Remove Directly',
      'Generate Script',
    )

    if (!choice) {
      log('Clean configuration cancelled by user')
      return
    }
  }

  if (choice === 'Remove Directly') {
    log('Removing symlinks directly...')
    const result = await removeSymlinksDirectly(workspaceRoot)

    if (result.errors.length > 0) {
      vscode.window.showWarningMessage(
        `Symlinks removed with ${result.failed} errors. Check output for details.`,
      )
    } else if (result.success > 0) {
      vscode.window.showInformationMessage(
        `Successfully removed ${result.success} symlinks`,
      )
    } else {
      vscode.window.showInformationMessage('No symlinks found to remove')
    }
    log(
      `Direct removal complete: ${result.success} success, ${result.failed} failed`,
    )
    return
  }

  log(
    'Generating clean configuration scripts (user chose scripts over direct removal)...',
  )

  const isWindows = os.platform() === 'win32'

  try {
    log('Generating clean script...')
    const targetOS = isWindows ? 'windows' : 'unix'
    await cleanScript(workspaceRoot, targetOS)
    if (isWindows) {
      await generateAdminScript(workspaceRoot)
    }
    log('Clean script generated')
    const scriptPath = path.join(
      workspaceRoot,
      isWindows ? FILE_NAMES.CLEAN_SYMLINKS_BAT : FILE_NAMES.CLEAN_SYMLINKS_SH,
    )

    if (silent) {
      const document = await vscode.workspace.openTextDocument(scriptPath)
      await vscode.window.showTextDocument(document)
    } else {
      if (isWindows) {
        await vscode.env.clipboard.writeText(path.basename(scriptPath))
      }

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
