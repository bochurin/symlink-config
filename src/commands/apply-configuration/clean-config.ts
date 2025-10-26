import { cleanScript, generateAdminScript } from './scripts'
import { removeSymlinksDirectly } from './direct'
import { getWorkspaceRoot } from '@state'
import { log } from '@log'
import { runScriptAsAdmin } from '@shared/script-runner'

import { FILE_NAMES } from '@shared/constants'
import { join, basename } from '@shared/file-ops'
import { platform, Platform } from '@shared/file-ops'
import { showError, warning, info, warningChoice, openTextDocument, showTextDocument, writeToClipboard } from '@shared/vscode'

export async function cleanConfig(silent = false): Promise<void> {
  const workspaceRoot = getWorkspaceRoot()
  if (!workspaceRoot) {
    log('ERROR: No workspace folder found')
    showError('No workspace folder found')
    return
  }

  // Offer direct removal or script generation
  let choice: string | undefined

  if (silent) {
    choice = 'Remove Directly'
  } else {
    choice = await warningChoice(
      'Remove symlinks handled by the extension?',
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
      warning(
        `Symlinks removed with ${result.failed} errors. Check output for details.`,
      )
    } else if (result.success > 0) {
      info(
        `Successfully removed ${result.success} symlinks`,
      )
    } else {
      info('No symlinks found to remove')
    }
    log(
      `Direct removal complete: ${result.success} success, ${result.failed} failed`,
    )
    return
  }

  log(
    'Generating clean configuration scripts (user chose scripts over direct removal)...',
  )

  const currentPlatform = platform()

  try {
    log('Generating clean script...')
    const targetOS = currentPlatform === Platform.Windows ? 'windows' : 'unix'
    await cleanScript(workspaceRoot, targetOS)
    if (currentPlatform === Platform.Windows) {
      await generateAdminScript(workspaceRoot)
    }
    log('Clean script generated')
    const scriptPath = join(
      workspaceRoot,
      currentPlatform === Platform.Windows ? FILE_NAMES.CLEAN_SYMLINKS_BAT : FILE_NAMES.CLEAN_SYMLINKS_SH,
    )

    if (silent) {
      const document = await openTextDocument(scriptPath)
      await showTextDocument(document)
    } else {
      if (currentPlatform === Platform.Windows) {
        await writeToClipboard(basename(scriptPath))
      }

      const options = ['Open in Code', 'Run Now']
      const choice = await warningChoice(
        `Cleaning script generated: ${basename(scriptPath)}`,
        ...options,
      )

      if (choice === 'Open in Code') {
        const document = await openTextDocument(scriptPath)
        await showTextDocument(document)
      } else if (choice === 'Run Now') {
        runScriptAsAdmin(scriptPath, workspaceRoot)
      }
    }
  } catch (error) {
    log(`ERROR: Failed to generate cleaning script: ${error}`)
    showError(
      `Failed to generate cleaning script: ${error}`,
    )
  }
}
