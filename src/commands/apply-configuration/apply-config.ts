import * as vscode from 'vscode'
import * as os from 'os'
import * as path from 'path'
import { getWorkspaceRoot } from '@state'
import { log } from '@shared/log'
import { info } from '@shared/vscode/info'
import { generateTree } from '@views/symlink-tree/generate'
import { collectSymlinkOperations } from './collect-operations'
import { generateApplyWindowsScript } from './generate-apply-windows-script'
import { generateApplyUnixScript } from './generate-apply-unix-script'
import { useSymlinkConfigManager } from '@managers'
import { SETTINGS, FILE_NAMES } from '@shared/constants'
import { confirm } from '@shared/vscode'
import { generateAdminScript } from './generate-admin-script'
import { runScriptAsAdmin } from '@shared/script-runner'

export async function applyConfig() {
  const workspaceRoot = getWorkspaceRoot()

  const settingsManager = useSymlinkConfigManager()

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

    const scriptGeneration = settingsManager.read(
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
        runScriptAsAdmin(scriptPath, workspaceRoot)
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
        runScriptAsAdmin(scriptPath, workspaceRoot)
      }
    }
  } catch (error) {
    log(`ERROR: Failed to apply configuration: ${error}`)
    vscode.window.showErrorMessage(`Failed to apply configuration: ${error}`)
  }
}
