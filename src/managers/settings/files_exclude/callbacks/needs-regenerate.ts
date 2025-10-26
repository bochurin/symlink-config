import { log } from '@log'
import { SETTINGS } from '@shared/constants'
import { SettingsEvent } from '@shared/hooks/use-settings-watcher'

import { useSymlinkConfigManager } from '@/src/managers'

export function needsRegenerateCallback(params?: {
  event?: SettingsEvent
}): boolean {
  const event = params?.event

  const settingsManager = useSymlinkConfigManager()

  const hideServiceFiles = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
  )
  const hideSymlinkConfigs = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
  )

  const result = hideServiceFiles || hideSymlinkConfigs

  log(`files.exclude needsRegenerate, result=${result}`)
  return result as boolean
}
