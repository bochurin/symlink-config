import { FILE_NAMES, SETTINGS } from '@shared/constants'

import { GitignoringPart } from '../enums'

import {
  useCurrentSymlinkConfigManager,
  useSymlinkConfigManager,
} from '@/src/managers'

export function generateCallback(params?: {
  mode?: GitignoringPart
}): Record<string, { spacing: string; active: boolean }> {
  const mode = params?.mode ?? GitignoringPart.All

  const settingsManager = useSymlinkConfigManager()
  const currentConfigManager = useCurrentSymlinkConfigManager()

  const generatedEntries: Record<string, { spacing: string; active: boolean }> =
    {}

  try {
    if (mode === GitignoringPart.All || mode === GitignoringPart.ServiceFiles) {
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
      generatedEntries[FILE_NAMES.CLEAN_SYMLINKS_BAT] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
      generatedEntries[FILE_NAMES.CLEAN_SYMLINKS_SH] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
      generatedEntries[FILE_NAMES.RUN_ADMIN_BAT] = {
        spacing: '',
        active: gitignoreServiceFiles,
      }
    }

    if (mode === GitignoringPart.All || mode === GitignoringPart.Symlinks) {
      // Add created symlinks to gitignore
      const gitignoreSymlinks = settingsManager.read(
        SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS,
      ) as boolean

      const currentConfigString = currentConfigManager.read()
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
