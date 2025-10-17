import { readConfig } from '../../shared/config-ops'
import { SETTINGS } from '../../shared/constants'
import { SymlinkSettingsParameter, SymlinkSettingsValue } from './types'

export function read(
  parameter: SymlinkSettingsParameter,
): SymlinkSettingsValue {
  try {
    const configKey = `${SETTINGS.SYMLINK_CONFIG.SECTION}.${parameter}`
    const defaults = SETTINGS.SYMLINK_CONFIG.DEFAULT

    switch (parameter) {
      case SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION:
        return readConfig<string>(configKey, defaults.SCRIPT_GENERATION)
      case SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES:
        return readConfig<boolean>(configKey, defaults.GITIGNORE_SERVICE_FILES)
      case SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS:
        return readConfig<boolean>(configKey, defaults.GITIGNORE_SYMLINKS)
      case SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES:
      case SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS:
        return readConfig<boolean>(
          configKey,
          defaults[
            parameter === SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES
              ? 'HIDE_SERVICE_FILES'
              : 'HIDE_SYMLINK_CONFIGS'
          ],
        )
      case SETTINGS.SYMLINK_CONFIG.SYMLINK_PATH_MODE:
        return readConfig<string>(configKey, defaults.SYMLINK_PATH_MODE)
      case SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE:
        return readConfig<boolean>(configKey, defaults.WATCH_WORKSPACE)
      case SETTINGS.SYMLINK_CONFIG.MAX_LOG_ENTRIES:
        return readConfig<number>(configKey, defaults.MAX_LOG_ENTRIES)
    }
  } catch {
    // Return package.json defaults on error
    return SETTINGS.SYMLINK_CONFIG.DEFAULT[
      parameter as keyof typeof SETTINGS.SYMLINK_CONFIG.DEFAULT
    ]
  }
}
