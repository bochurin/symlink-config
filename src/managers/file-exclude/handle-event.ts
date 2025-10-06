import { make } from './make'
import * as symlinkConfigManager from '../symlink-config'

export async function handleEvent() {
  const hideServiceFiles = symlinkConfigManager.read('hideServiceFiles')
  const hideSymlinkConfigs = symlinkConfigManager.read('hideSymlinkConfigs')

  if (hideServiceFiles || hideSymlinkConfigs) {
    await make()
  }
}
