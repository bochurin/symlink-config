import { readFromConfig } from '../../shared/config-ops'
import { ExclusionMode } from '../../types'

export function buildExclusions(mode?: ExclusionMode): Record<string, boolean> {
  mode = mode || ExclusionMode.All

  const exclusions: Record<string, boolean> = {}

  if (mode === ExclusionMode.All || mode === ExclusionMode.ServiceFiles) {
    // Service files
    const hideServiceFiles = readFromConfig<boolean>('symlink-config.hideServiceFiles', false)
    exclusions['next.symlink.config.json'] = hideServiceFiles
  }

  if (mode === ExclusionMode.All || mode === ExclusionMode.SymlinkConfigs) {
    // Symlink config
    const hideSymlinkConfig = readFromConfig<boolean>('symlink-config.hideSymlinkConfigs', false)
    exclusions['**/symlink.config.json'] = hideSymlinkConfig
  }

  return exclusions
}
