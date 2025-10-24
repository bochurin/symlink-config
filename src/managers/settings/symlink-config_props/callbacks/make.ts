import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'
import { SETTINGS } from '@/src/shared/constants'
import { info, warning } from '@/src/shared/vscode'
import { ExclusionPart, useFilesExcludeManager } from '@managers'
import { GitignoringPart, useGitignoreManager } from '@managers'
import { SymlinkConfigSettingsPropertyValue } from '../types'
import * as vscode from 'vscode'
import * as fs from 'fs'
import { log } from '@/src/shared/log'

export function makeCallback(params?: {
  event?: SettingsEvent
  initialContent?: Record<string, SymlinkConfigSettingsPropertyValue>
}): Record<string, SymlinkConfigSettingsPropertyValue> | undefined {
  const event = params?.event
  if (!event) return

  const filesExcludeManager = useFilesExcludeManager()
  const gitignoreManager = useGitignoreManager()

  switch (event.section) {
    case SETTINGS.SYMLINK_CONFIG.SECTION:
      switch (event.parameter) {
        case SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES:
          info(
            //TODO: use constants for messages
            `Gitignoring service files ${event.value ? 'enabled' : 'disabled'}.`,
          )
          gitignoreManager.make(GitignoringPart.ServiceFiles)
          break

        case SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS:
          info(
            `Gitignoring created symlinks ${event.value ? 'enabled' : 'disabled'}.`,
          )
          gitignoreManager.make(GitignoringPart.Symlinks)
          break

        case SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES:
        case SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS:
          const object =
            event.parameter === SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES
              ? 'service files'
              : 'symlink configs'
          const action = event.value ? 'enabled' : 'disabled'
          const mode =
            event.parameter === SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES
              ? ExclusionPart.ServiceFiles
              : ExclusionPart.SymlinkConfigs
          info(`Hiding ${object} ${action}.`)
          filesExcludeManager.make(mode)
          break

        case SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE:
          const watchMessage = event.value
            ? 'Workspace watching enabled.'
            : 'Workspace watching disabled. Use Refresh command to manually update.'
          info(watchMessage)
          break

        case SETTINGS.SYMLINK_CONFIG.PROJECT_ROOT:
          if (event.value && typeof event.value === 'string') {
            if (
              !fs.existsSync(event.value) ||
              !fs.statSync(event.value).isDirectory()
            ) {
              log(
                `Invalid project root path: ${event.value}, reverting to previous value`,
              )
              warning(`Invalid project root path: ${event.value}`)

              const config = vscode.workspace.getConfiguration('symlink-config')
              config.update(
                'projectRoot',
                event.oldValue,
                vscode.ConfigurationTarget.Workspace,
              )
              return
            }
            log(`Project root updated to: ${event.value}`)
            info(`Project root updated to: ${event.value}`)
          }
          break

        case SETTINGS.SYMLINK_CONFIG.RESET_TO_DEFAULTS:
          if (event.value === true && params?.initialContent) {
            const newContent: Record<
              string,
              SymlinkConfigSettingsPropertyValue
            > = {}
            for (const key in params.initialContent) {
              newContent[key] =
                SETTINGS.SYMLINK_CONFIG.DEFAULT[
                  key as keyof typeof SETTINGS.SYMLINK_CONFIG.DEFAULT
                ]
            }
            info('All settings reset to defaults')
            return newContent
          }
          break

        default:
      }
      break
  }
}
