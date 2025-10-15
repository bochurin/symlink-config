import { SettingsEvent } from '../../hooks/use-settings-watcher'
import { info } from '../../shared/vscode'
import { read as readSymlinkSettings } from '../symlink-settings'
import { make } from './make'

export async function handleEvent(event: SettingsEvent) {
  const hideServiceFiles = readSymlinkSettings('hideServiceFiles')
  const hideSymlinkConfigs = readSymlinkSettings('hideSymlinkConfigs')

  if (hideServiceFiles || hideSymlinkConfigs) {
    info('files.exclude section was modified. Checking ...')
    await make()
  }
}
