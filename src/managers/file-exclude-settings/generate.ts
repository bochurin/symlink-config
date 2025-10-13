import { read as readSymlinkSettings } from '../symlink-settings'
import { ExclusionPart } from './types'
import { FILE_NAMES } from '../../shared/constants'

export function generate(mode: ExclusionPart): Record<string, boolean> {
  const generatedExclusions: Record<string, boolean> = {}

  try {
    if (mode == ExclusionPart.All || mode == ExclusionPart.ServiceFiles) {
      const hideServiceFiles = readSymlinkSettings('hideServiceFiles') as boolean
      generatedExclusions[FILE_NAMES.NEXT_SYMLINK_CONFIG] = hideServiceFiles
      generatedExclusions[FILE_NAMES.CURRENT_SYMLINK_CONFIG] = hideServiceFiles
      generatedExclusions[FILE_NAMES.APPLY_SYMLINKS_BAT] = hideServiceFiles
      generatedExclusions[FILE_NAMES.APPLY_SYMLINKS_SH] = hideServiceFiles
      generatedExclusions[FILE_NAMES.CLEAR_SYMLINKS_BAT] = hideServiceFiles
      generatedExclusions[FILE_NAMES.CLEAR_SYMLINKS_SH] = hideServiceFiles
      generatedExclusions[FILE_NAMES.RUN_ADMIN_BAT] = hideServiceFiles
    }

    if (mode == ExclusionPart.All || mode == ExclusionPart.SymlinkConfigs) {
      const hideSymlinkConfigs = readSymlinkSettings('hideSymlinkConfigs') as boolean
      generatedExclusions[`**/${FILE_NAMES.SYMLINK_CONFIG}`] =
        hideSymlinkConfigs
    }
  } catch {}

  return generatedExclusions
}
