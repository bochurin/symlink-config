import { info } from '../../shared/vscode'
import * as symlinkConfigManager from '../symlink-config'
import { make } from './make'

export async function handleEvent() {
  const hideServiceFiles = symlinkConfigManager.read('hideServiceFiles')
  const hideSymlinkConfigs = symlinkConfigManager.read('hideSymlinkConfigs')

  if (hideServiceFiles || hideSymlinkConfigs) {
    info('files.exclude section was modified. Checking ...')
    await make()
  }
}
