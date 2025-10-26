import { warning, info } from '@dialogs'
import { log } from '@log'
import { ExclusionPart, useFilesExcludeManager , GitignoringPart, useGitignoreManager } from '@managers'
import { pathExists, isDirectory } from '@shared/file-ops'
import { getConfiguration, ConfigurationTarget } from '@shared/vscode'

import { SymlinkConfigSettingsPropertyValue } from '../types'


import { SETTINGS } from '@/src/shared/constants'
import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'

export function makeCallback(params?: {
  event?: SettingsEvent
  initialContent?: Record<string, SymlinkConfigSettingsPropertyValue>
}): Record<string, SymlinkConfigSettingsPropertyValue> | undefined {
  const event = params?.event
  if (!event) {return}

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
              !pathExists(event.value) ||
              !isDirectory(event.value)
            ) {
              log(
                `Invalid project root path: ${event.value}, reverting to previous value`,
              )
              warning(`Invalid project root path: ${event.value}`)

              const config = getConfiguration('symlink-config')
              config.update(
                'projectRoot',
                event.oldValue,
                ConfigurationTarget.Workspace,
              )
              return
            }
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
