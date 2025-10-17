import { SettingsEvent } from '../../shared/hooks/use-settings-watcher'
import { log } from '../../shared/log'
import { SETTINGS } from '../../shared/constants'
import { read as readSymlinkSettings } from '../symlink-settings'

export function needsRegenerate(event?: SettingsEvent): boolean {
  const hideServiceFiles = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
  )
  const hideSymlinkConfigs = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
  )

  const result = hideServiceFiles || hideSymlinkConfigs

  log(
    `files.exclude needsRegenerate: event=${event || 'none'}, result=${result}`,
  )
  return result as boolean
}
