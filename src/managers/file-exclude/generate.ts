import * as symlinkConfigManager from '../symlink-config'
import { GenerationMode } from './types'

export function generate(mode: GenerationMode): Record<string, boolean> {
  const generatedExclusions: Record<string, boolean> = {}

  try {
    if (mode == GenerationMode.All || mode == GenerationMode.ServiceFiles) {
      const hideServiceFiles = symlinkConfigManager.read('hideServiceFiles')
      generatedExclusions['next.symlink.config.json'] = hideServiceFiles
    }

    if (mode == GenerationMode.All || mode == GenerationMode.SymlinkConfigs) {
      const hideSymlinkConfigs = symlinkConfigManager.read('hideSymlinkConfigs')
      generatedExclusions['**/symlink.config.json'] = hideSymlinkConfigs
    }
  } catch {}

  return generatedExclusions
}
