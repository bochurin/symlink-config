import * as symlinkConfigManager from '../symlink-config'
import { read } from './read'
import { Mode } from './types'

export function build(mode?: Mode): Record<string, boolean> {
  mode = mode || Mode.All

  const exclusions: Record<string, boolean> = {}

  try {
    if (mode === Mode.All || mode === Mode.ServiceFiles) {
      const hideServiceFiles = symlinkConfigManager.read('hideServiceFiles')
      exclusions['next.symlink.config.json'] = hideServiceFiles
    }

    if (mode === Mode.All || mode === Mode.SymlinkConfigs) {
      const hideSymlinkConfigs = symlinkConfigManager.read('hideSymlinkConfigs')
      exclusions['**/symlink.config.json'] = hideSymlinkConfigs
    }
  } catch {}

  const currentExclusions = read()
  const builtExclusions = { ...currentExclusions, ...exclusions }

  return builtExclusions
}
