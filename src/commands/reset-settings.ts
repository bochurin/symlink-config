import { info } from '@dialogs'
import { SETTINGS } from '@shared/constants'
import { writeSettings } from '@shared/settings-ops'

export async function resetSettings(): Promise<void> {
  const properties = [
    SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS,
    SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
    SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
    SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION,
    SETTINGS.SYMLINK_CONFIG.SYMLINK_PATH_MODE,
    SETTINGS.SYMLINK_CONFIG.CONTINUOUS_MODE,
    SETTINGS.SYMLINK_CONFIG.SILENT,
    SETTINGS.SYMLINK_CONFIG.PROJECT_ROOT,
    SETTINGS.SYMLINK_CONFIG.MAX_LOG_ENTRIES,
  ]

  for (const property of properties) {
    await writeSettings(property, undefined)
  }

  info('All symlink-config settings reset to defaults')
}
