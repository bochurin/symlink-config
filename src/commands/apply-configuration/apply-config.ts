import { choice, warning, showError, info } from '@dialogs'
import { log, LogLevel } from '@log'
import { useSymlinkConfigManager } from '@managers'
import { isRunningAsAdmin } from '@shared/admin-detection'
import { SETTINGS, FILE_NAMES } from '@shared/constants'
import { join, basename , platform, Platform } from '@shared/file-ops'
import { runScriptAsAdmin } from '@shared/script-runner'
import { openTextDocument, showTextDocument, writeToClipboard } from '@shared/vscode'
import { getWorkspaceRoot } from '@state'

import { createSymlinksDirectly } from './direct'
import { applyScript, generateAdminScript } from './scripts'
import { collectOperations, filterDangerousSources } from './utils'

export async function applyConfig() {
  const workspaceRoot = getWorkspaceRoot()
  const settingsManager = useSymlinkConfigManager()
  const continuousMode = settingsManager.read(SETTINGS.SYMLINK_CONFIG.CONTINUOUS_MODE)

  try {
    // Collect symlink operations based on mode
    const operations = collectOperations()
    log(`Found ${operations.length} symlink operations`)

    if (operations.length === 0) {
      log('No symlink operations needed')
      info('No symlink operations needed')
      return
    }

    // Filter dangerous sources from create operations
    let safeOperations: typeof operations
    if (continuousMode) {
      // In continuous mode, automatically skip dangerous sources
      const { minimatch } = await import('minimatch')
      const { DANGEROUS_SOURCES } = await import('@shared/constants')
      
      const dangerousOps = operations.filter((op) => {
        if (op.type !== 'create') {return false}
        const source = op.source.replace(/^@/, '')
        const isDangerousPattern = DANGEROUS_SOURCES.PATTERNS.some((pattern) =>
          minimatch(source, pattern, { nocase: true }),
        )
        const sourceName = basename(source)
        const targetName = basename(op.target)
        const isSameName = sourceName === targetName
        return isDangerousPattern && isSameName
      })
      
      safeOperations = operations.filter((op) => !dangerousOps.includes(op))
      if (dangerousOps.length > 0) {
        log(`Continuous mode: automatically skipped ${dangerousOps.length} dangerous operations`)
      }
    } else {
      safeOperations = await filterDangerousSources(operations)
    }
    
    if (safeOperations.length === 0) {
      log('No operations to process after filtering')
      return
    }

    // Check admin status and show appropriate dialog
    const isAdmin = isRunningAsAdmin()
    let userChoice: string | undefined

    if (continuousMode) {
      userChoice = 'Generate Scripts'
      log('Continuous mode: generating scripts automatically')
    } else {
      if (isAdmin) {
        userChoice = await choice(
          'Apply symlink configuration?',
          'Create Directly',
          'Generate Scripts',
          'Cancel',
        )
      } else {
        userChoice = await choice(
          'Apply symlink configuration?',
          'Generate Scripts',
          'Cancel',
        )
      }

      if (!userChoice || userChoice === 'Cancel') {
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
        info(`Successfully created ${result.success} symlinks`)
      }
      log(
        `Direct creation complete: ${result.success} success, ${result.failed} failed`,
      )
      return
    }

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
      log('Generating apply scripts...')
      
      if (shouldGenerateWindows) {
        await applyScript(safeOperations, workspaceRoot, 'windows')
        await generateAdminScript(workspaceRoot, 'windows')
        log('Windows apply script generated')
      }
      
      if (shouldGenerateUnix) {
        await applyScript(safeOperations, workspaceRoot, 'unix')
        await generateAdminScript(workspaceRoot, 'unix')
        log('Unix apply script generated')
      }
      
      const scriptPath = join(
        workspaceRoot,
        currentPlatform === Platform.Windows
          ? FILE_NAMES.APPLY_SYMLINKS_BAT
          : FILE_NAMES.APPLY_SYMLINKS_SH,
      )

      if (continuousMode) {
        const document = await openTextDocument(scriptPath)
        await showTextDocument(document)
        log('Continuous mode: opened script in Code')
      } else {
        if (currentPlatform === Platform.Windows) {
          await writeToClipboard(basename(scriptPath))
        }

        const options = currentPlatform === Platform.Windows
          ? ['Open in Code', 'Run as Admin']
          : ['Open in Code', 'Run Now']
        const scriptChoice = await choice(
          `Applying script generated: ${basename(scriptPath)}`,
          ...options,
        )

        if (scriptChoice === 'Open in Code') {
          const document = await openTextDocument(scriptPath)
          await showTextDocument(document)
        } else if (scriptChoice === 'Run as Admin' || scriptChoice === 'Run Now') {
          runScriptAsAdmin(scriptPath, workspaceRoot)
        }
      }
    }
  } catch (error) {
    log(`ERROR: Failed to apply configuration: ${error}`)
    showError(`Failed to apply configuration: ${error}`)
  }
}
