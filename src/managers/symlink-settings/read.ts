import { readConfig } from '../../shared/config-ops'
import { CONFIG } from '../../shared/constants'
import { SymlinkSettingsParameter, SymlinkSettingsValue } from './types'

export function read(
  parameter: SymlinkSettingsParameter,
): SymlinkSettingsValue {
  try {
    const configKey = `${CONFIG.SYMLINK_CONFIG.SECTION}.${parameter}`
    const defaults = CONFIG.SYMLINK_CONFIG.DEFAULT

    switch (parameter) {
      case CONFIG.SYMLINK_CONFIG.SCRIPT_GENERATION:
        return readConfig<string>(configKey, defaults.SCRIPT_GENERATION)
      case CONFIG.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES:
        return readConfig<boolean>(configKey, defaults.GITIGNORE_SERVICE_FILES)
      case CONFIG.SYMLINK_CONFIG.HIDE_SERVICE_FILES:
      case CONFIG.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS:
        return readConfig<boolean>(
          configKey,
          defaults[
            parameter === CONFIG.SYMLINK_CONFIG.HIDE_SERVICE_FILES
              ? 'HIDE_SERVICE_FILES'
              : 'HIDE_SYMLINK_CONFIGS'
          ],
        )
      case CONFIG.SYMLINK_CONFIG.SYMLINK_PATH_MODE:
        return readConfig<string>(configKey, defaults.SYMLINK_PATH_MODE)
      case CONFIG.SYMLINK_CONFIG.WATCH_WORKSPACE:
        return readConfig<boolean>(configKey, defaults.WATCH_WORKSPACE)
    }
  } catch {
    // Return package.json defaults on error
    return CONFIG.SYMLINK_CONFIG.DEFAULT[
      parameter as keyof typeof CONFIG.SYMLINK_CONFIG.DEFAULT
    ]
  }
}
