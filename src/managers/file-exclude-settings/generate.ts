import { useSymlinkConfigSettingsMananger } from '@/src/managers'
import { ExclusionPart } from './enums'
import { FILE_NAMES, SETTINGS } from '@shared/constants'

export function generate(mode?: ExclusionPart): Record<string, boolean> {
  mode = mode ?? ExclusionPart.All

  const settingsManager = useSymlinkConfigSettingsMananger()

  const generatedExclusions: Record<string, boolean> = {}

  try {
    if (mode == ExclusionPart.All || mode == ExclusionPart.ServiceFiles) {
      const hideServiceFiles = settingsManager.read(
        SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
      ) as boolean
      generatedExclusions[FILE_NAMES.NEXT_SYMLINK_CONFIG] = hideServiceFiles
      generatedExclusions[FILE_NAMES.CURRENT_SYMLINK_CONFIG] = hideServiceFiles
      generatedExclusions[FILE_NAMES.APPLY_SYMLINKS_BAT] = hideServiceFiles
      generatedExclusions[FILE_NAMES.APPLY_SYMLINKS_SH] = hideServiceFiles
      generatedExclusions[FILE_NAMES.CLEAR_SYMLINKS_BAT] = hideServiceFiles
      generatedExclusions[FILE_NAMES.CLEAR_SYMLINKS_SH] = hideServiceFiles
      generatedExclusions[FILE_NAMES.RUN_ADMIN_BAT] = hideServiceFiles
    }

    if (mode == ExclusionPart.All || mode == ExclusionPart.SymlinkConfigs) {
      const hideSymlinkConfigs = settingsManager.read(
        SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
      ) as boolean
      generatedExclusions[`**/${FILE_NAMES.SYMLINK_CONFIG}`] =
        hideSymlinkConfigs
    }
  } catch {}

  return generatedExclusions
}
