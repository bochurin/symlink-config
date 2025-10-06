import * as symlinkConfigManager from '../symlink-config'
import { read } from './read'

export function generate(
  mode?: 'all' | 'serviceFiles' | 'symlinkConfigs'
): Record<string, boolean> {
  mode = mode || 'all'

  const exclusions: Record<string, boolean> = {}

  try {
    if (mode === 'all' || mode === 'serviceFiles') {
      const hideServiceFiles = symlinkConfigManager.read('hideServiceFiles')
      exclusions['next.symlink.config.json'] = hideServiceFiles
    }

    if (mode === 'all' || mode === 'symlinkConfigs') {
      const hideSymlinkConfigs = symlinkConfigManager.read('hideSymlinkConfigs')
      exclusions['**/symlink.config.json'] = hideSymlinkConfigs
    }
  } catch {}

  const currentExclusions = read()
  const builtExclusions = { ...currentExclusions, ...exclusions }

  return builtExclusions
}
