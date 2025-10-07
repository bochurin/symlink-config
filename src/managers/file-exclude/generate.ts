import * as symlinkConfigManager from '../symlink-config'
import { read } from './read'

export function generate(
  mode?: 'all' | 'serviceFiles' | 'symlinkConfigs'
): Record<string, boolean> {
  mode = mode || 'all'

  const generatedExclusions: Record<string, boolean> = {}

  try {
    if (mode === 'all' || mode === 'serviceFiles') {
      const hideServiceFiles = symlinkConfigManager.read('hideServiceFiles')
      generatedExclusions['next.symlink.config.json'] = hideServiceFiles
    }

    if (mode === 'all' || mode === 'symlinkConfigs') {
      const hideSymlinkConfigs = symlinkConfigManager.read('hideSymlinkConfigs')
      generatedExclusions['**/symlink.config.json'] = hideSymlinkConfigs
    }
  } catch {}

  return generatedExclusions
}
