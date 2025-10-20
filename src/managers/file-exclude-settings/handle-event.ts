import { SettingsEvent } from '@shared/hooks/use-settings-watcher'
import { info } from '@shared/vscode'
import { useSymlinkConfigSettingsMananger } from '@/src/managers'
import { make } from './make'
import { SETTINGS } from '@shared/constants'

export async function handleEvent(event: SettingsEvent) {
  const settingsManager = useSymlinkConfigSettingsMananger()

  const hideServiceFiles = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
  )
  const hideSymlinkConfigs = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
  )

  if (hideServiceFiles || hideSymlinkConfigs) {
    info('files.exclude section was modified. Checking ...')
    await make()
  }
}
