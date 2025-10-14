import { make as makeGitignore } from '../gitignore-file'
import { make as makeExclusion, ExclusionPart } from '../file-exclude-settings'
import { info } from '../../shared/vscode'
import { SETTINGS } from '../../shared/constants'
import { makeWatchers } from '../../extension/make-watchers'

export async function handleEvent(
  section: string,
  parameter: string,
  payload: { value: any; old_value: any },
) {
  switch (section) {
    case SETTINGS.SYMLINK_CONFIG.SECTION:
      switch (parameter) {
        case SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES:
          info(
            //TODO: use constants for messages
            `Gitignoring service files ${payload.value ? 'enabled' : 'disabled'}.`,
          )
          await makeGitignore()
          break

        case SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES:
        case SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS:
          const object =
            parameter === SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES
              ? 'service files'
              : 'symlink configs'
          const action = payload.value ? 'enabled' : 'disabled'
          const mode =
            parameter === SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES
              ? ExclusionPart.ServiceFiles
              : ExclusionPart.SymlinkConfigs
          info(`Hiding ${object} ${action}.`)
          await makeExclusion(mode)
          break

        case SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE:
          break

        default:
      }
      makeWatchers()
      break
  }
}
