import {
  GitignoringPart,
  make as makeGitignore,
} from '@managers/gitignore-file'
import {
  make as makeExclusion,
  ExclusionPart,
} from '@managers/file-exclude-settings'
import { info } from '@shared/vscode'
import { SETTINGS } from '@shared/constants'
import { makeWatchers } from '@extension'
import { SettingsEvent } from '@shared/hooks/use-settings-watcher'

export async function handleEvent(event: SettingsEvent) {
  switch (event.section) {
    case SETTINGS.SYMLINK_CONFIG.SECTION:
      switch (event.parameter) {
        case SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES:
          info(
            //TODO: use constants for messages
            `Gitignoring service files ${event.value ? 'enabled' : 'disabled'}.`,
          )
          await makeGitignore(GitignoringPart.ServiceFiles)
          break

        case SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS:
          info(
            `Gitignoring created symlinks ${event.value ? 'enabled' : 'disabled'}.`,
          )
          await makeGitignore(GitignoringPart.Symlinks)
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
          await makeExclusion(mode)
          break

        case SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE:
          info(`Workspace watching ${event.value ? 'enabled' : 'disabled'}.`)
          break

        default:
      }
      makeWatchers()
      break
  }
}
