import * as vscode from 'vscode'
import * as path from 'path'
import { getWorkspaceRoot } from '@state'
import { log } from '@log'
import { choice, warning } from '@shared/vscode'
import { LogLevel } from '@log'
import { collectOperations, filterDangerousSources } from './utils'
import { applyScript, generateAdminScript } from './scripts'
import { createSymlinksDirectly } from './direct'
import { useSymlinkConfigManager } from '@managers'
import { SETTINGS, FILE_NAMES } from '@shared/constants'
import { confirm } from '@shared/vscode'
import { runScriptAsAdmin } from '@shared/script-runner'
import { isRunningAsAdmin } from '@shared/admin-detection'
import { platform, Platform } from '@shared/file-ops'

export async function applyConfig(silent = false) {
  const workspaceRoot = getWorkspaceRoot()

  try {
    // Collect symlink operations based on mode
    const operations = collectOperations()
    log(`Found ${operations.length} symlink operations`)

    if (operations.length === 0) {
      log('No symlink operations needed')
      log('No symlink operations needed', LogLevel.Info)
      return
    }

    // Filter dangerous sources from create operations
    const safeOperations = await filterDangerousSources(operations)
    if (safeOperations.length === 0) {
      log('No operations to process after filtering')
      return
    }

    // Check admin status and show appropriate dialog
    const isAdmin = await isRunningAsAdmin()
    let userChoice: string | undefined

    if (silent) {
      userChoice = isAdmin ? 'Create Directly' : 'Generate Scripts'
    } else {
      if (isAdmin) {
        userChoice = await choice(
          'Apply symlink configuration?',
          'Create Directly',
          'Generate Scripts',
        )
      } else {
        const confirmed = await confirm(
          'Apply symlink configuration?',
          'Generate Scripts',
        )
        userChoice = confirmed ? 'Generate Scripts' : undefined
      }

      if (!userChoice) {
        log('Apply configuration cancelled by user')
        return
      }
    }

    if (userChoice === 'Create Directly') {
      log('Creating symlinks directly...')
      const result = await createSymlinksDirectly(safeOperations, workspaceRoot)

      if (result.errors.length > 0) {
        warning(
          `Symlinks created with ${result.failed} errors. Check output for details.`,
        )
      } else {
        log(`Successfully created ${result.success} symlinks`, LogLevel.Info)
      }
      log(
        `Direct creation complete: ${result.success} success, ${result.failed} failed`,
      )
      return
    }

    const settingsManager = useSymlinkConfigManager()
    const scriptGeneration = settingsManager.read(
      SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION,
    )
    log('Generating scripts...')
    const currentPlatform = platform()

    const shouldGenerateWindows =
      scriptGeneration === 'windows-only' ||
      scriptGeneration === 'both' ||
      (scriptGeneration === 'auto' && currentPlatform === Platform.Windows)
    const shouldGenerateUnix =
      scriptGeneration === 'unix-only' ||
      scriptGeneration === 'both' ||
      (scriptGeneration === 'auto' && currentPlatform === Platform.Unix)

    if (shouldGenerateWindows || shouldGenerateUnix) {
      log('Generating apply script...')
      const targetOS = currentPlatform === Platform.Windows ? 'windows' : 'unix'
      await applyScript(safeOperations, workspaceRoot, targetOS)
      if (currentPlatform === Platform.Windows) {
        await generateAdminScript(workspaceRoot)
      }
      log('Apply script generated')
      const scriptPath = path.join(
        workspaceRoot,
        currentPlatform === Platform.Windows
          ? FILE_NAMES.APPLY_SYMLINKS_BAT
          : FILE_NAMES.APPLY_SYMLINKS_SH,
      )

      if (silent) {
        const document = await vscode.workspace.openTextDocument(scriptPath)
        await vscode.window.showTextDocument(document)
      } else {
        if (currentPlatform === Platform.Windows) {
          await vscode.env.clipboard.writeText(path.basename(scriptPath))
        }

        const options = currentPlatform === Platform.Windows
          ? ['Open in Code', 'Run as Admin']
          : ['Open in Code', 'Run Now']
        const scriptChoice = await choice(
          `Applying script generated: ${path.basename(scriptPath)}`,
          ...options,
        )

        if (scriptChoice === 'Open in Code') {
          const document = await vscode.workspace.openTextDocument(scriptPath)
          await vscode.window.showTextDocument(document)
        } else if (scriptChoice === 'Run as Admin' || scriptChoice === 'Run Now') {
          runScriptAsAdmin(scriptPath, workspaceRoot)
        }
      }
    }
  } catch (error) {
    log(`ERROR: Failed to apply configuration: ${error}`)
    vscode.window.showErrorMessage(`Failed to apply configuration: ${error}`)
  }
}
