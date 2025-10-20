import { useSymlinkConfigSettingsMananger } from '@/src/managers'
import { read as readCurrentConfig } from '@managers/current-config'
import { FILE_NAMES, SETTINGS } from '@shared/constants'
import { GitignoringPart } from './enums'

export async function generate(
  mode?: GitignoringPart,
): Promise<Record<string, { spacing: string; active: boolean }>> {
  mode = mode ?? GitignoringPart.All

  const settingsManager = useSymlinkConfigSettingsMananger()

  const generatedEntries: Record<string, { spacing: string; active: boolean }> =
    {}

  try {
    if (mode == GitignoringPart.All || mode == GitignoringPart.ServiceFiles) {
      const gitignoreServiceFiles = settingsManager.read(
        SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
      ) as boolean
      generatedEntries[FILE_NAMES.NEXT_SYMLINK_CONFIG] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
      generatedEntries[FILE_NAMES.CURRENT_SYMLINK_CONFIG] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
      generatedEntries[FILE_NAMES.APPLY_SYMLINKS_BAT] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
      generatedEntries[FILE_NAMES.APPLY_SYMLINKS_SH] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
      generatedEntries[FILE_NAMES.CLEAR_SYMLINKS_BAT] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
      generatedEntries[FILE_NAMES.CLEAR_SYMLINKS_SH] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
      generatedEntries[FILE_NAMES.RUN_ADMIN_BAT] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
    }

    if (mode == GitignoringPart.All || mode == GitignoringPart.Symlinks) {
      // Add created symlinks to gitignore
      const gitignoreSymlinks = settingsManager.read(
        SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS,
      ) as boolean

      const currentConfigString = readCurrentConfig()
      if (currentConfigString) {
        const currentConfig = JSON.parse(currentConfigString)

        // Add directory symlinks to gitignore
        if (currentConfig.directories) {
          for (const dir of currentConfig.directories) {
            generatedEntries[dir.target.replace('@', '')] = {
              spacing: '',
              active: gitignoreSymlinks,
            }
          }
        }

        // Add file symlinks to gitignore
        if (currentConfig.files) {
          for (const file of currentConfig.files) {
            generatedEntries[file.target.replace('@', '')] = {
              spacing: '',
              active: gitignoreSymlinks,
            }
          }
        }
      }
    }
  } catch {}

  return generatedEntries
}
