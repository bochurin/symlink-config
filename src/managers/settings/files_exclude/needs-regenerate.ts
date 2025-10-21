import { SettingsEvent } from '@shared/hooks/use-settings-watcher'
import { log } from '@shared/log'
import { SETTINGS } from '@shared/constants'
import { useSymlinkConfigSettingsMananger } from '@/src/managers'

export function needsRegenerate(parameters?: {
  event?: SettingsEvent
}): boolean {
  const event = parameters?.event
  const settingsManager = useSymlinkConfigSettingsMananger()

  const hideServiceFiles = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
  )
  const hideSymlinkConfigs = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
  )

  const result = hideServiceFiles || hideSymlinkConfigs

  log(
    `files.exclude needsRegenerate: event=${event || 'none'}, result=${result}`,
  )
  return result as boolean
}
