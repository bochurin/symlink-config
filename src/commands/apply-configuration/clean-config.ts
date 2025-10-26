import { showError, warning, info, warningChoice } from '@dialogs'
import { log } from '@log'
import { useSymlinkConfigManager } from '@managers'
import { FILE_NAMES, SETTINGS } from '@shared/constants'
import { join, basename , platform, Platform } from '@shared/file-ops'
import { runScriptAsAdmin } from '@shared/script-runner'
import { openTextDocument, showTextDocument, writeToClipboard } from '@shared/vscode'
import { getWorkspaceRoot } from '@state'

import { removeSymlinksDirectly } from './direct'
import { cleanScript, generateAdminScript } from './scripts'

export async function cleanConfig(): Promise<void> {
  const workspaceRoot = getWorkspaceRoot()
  const settingsManager = useSymlinkConfigManager()
  const continuousMode = settingsManager.read(SETTINGS.SYMLINK_CONFIG.CONTINUOUS_MODE)
  
  if (!workspaceRoot) {
    log('ERROR: No workspace folder found')
    showError('No workspace folder found')
    return
  }

  // Offer direct removal or script generation
  let choice: string | undefined
  
  if (continuousMode) {
    choice = 'Generate Script'
    log('Continuous mode: generating clean script automatically')
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
  const scriptGeneration = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION,
  )

  const shouldGenerateWindows =
    scriptGeneration === 'windows-only' ||
    scriptGeneration === 'both' ||
    (scriptGeneration === 'auto' && currentPlatform === Platform.Windows)
  const shouldGenerateUnix =
    scriptGeneration === 'unix-only' ||
    scriptGeneration === 'both' ||
    (scriptGeneration === 'auto' && currentPlatform === Platform.Unix)

  try {
    log('Generating clean scripts...')
    
    if (shouldGenerateWindows) {
      await cleanScript(workspaceRoot, 'windows')
      await generateAdminScript(workspaceRoot, 'windows')
      log('Windows clean script generated')
    }
    
    if (shouldGenerateUnix) {
      await cleanScript(workspaceRoot, 'unix')
      await generateAdminScript(workspaceRoot, 'unix')
      log('Unix clean script generated')
    }
    const scriptPath = join(
      workspaceRoot,
      currentPlatform === Platform.Windows ? FILE_NAMES.CLEAN_SYMLINKS_BAT : FILE_NAMES.CLEAN_SYMLINKS_SH,
    )

    if (continuousMode) {
      const document = await openTextDocument(scriptPath)
      await showTextDocument(document)
      log('Continuous mode: opened clean script in Code')
    } else {
      if (currentPlatform === Platform.Windows) {
        await writeToClipboard(basename(scriptPath))
      }

      const options = ['Open in Code', 'Run Now']
      const scriptChoice = await warningChoice(
        `Cleaning script generated: ${basename(scriptPath)}`,
        ...options,
      )

      if (scriptChoice === 'Open in Code') {
        const document = await openTextDocument(scriptPath)
        await showTextDocument(document)
      } else if (scriptChoice === 'Run Now') {
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
