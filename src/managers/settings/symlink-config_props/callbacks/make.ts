import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'
import { SETTINGS } from '@/src/shared/constants'
import { info } from '@/src/shared/vscode'
import { makeWatchers } from '@/src/extension'
import { ExclusionPart, useFilesExcludeManager } from '@managers'
import { GitignoringPart, useGitignoreManager } from '@managers'

export function makeCallback(params?: { event?: SettingsEvent }): undefined {
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

        default:
      }
      makeWatchers()
      break
  }
}
