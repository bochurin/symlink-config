import { read as readSymlinkSettings } from '../symlink-settings'
import { ExclusionPart } from './types'

export function generate(mode: ExclusionPart): Record<string, boolean> {
  const generatedExclusions: Record<string, boolean> = {}

  try {
    if (mode == ExclusionPart.All || mode == ExclusionPart.ServiceFiles) {
      const hideServiceFiles = readSymlinkSettings('hideServiceFiles')
      generatedExclusions['next.symlink.config.json'] = hideServiceFiles
    }

    if (mode == ExclusionPart.All || mode == ExclusionPart.SymlinkConfigs) {
      const hideSymlinkConfigs = readSymlinkSettings('hideSymlinkConfigs')
      generatedExclusions['**/symlink.config.json'] = hideSymlinkConfigs
    }
  } catch {}

  return generatedExclusions
}
