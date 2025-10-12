import { readConfig } from '../../shared/config-ops'
import { CONFIG_SECTIONS, CONFIG_PARAMETERS, SYMLINK_SETTINGS_DEFAULTS } from '../../shared/constants'
import { SymlinkSettingsParameter, SymlinkSettingsValue } from './types'

export function read(
  parameter: SymlinkSettingsParameter,
): SymlinkSettingsValue {
  try {
    const configKey = `${CONFIG_SECTIONS.SYMLINK_CONFIG}.${parameter}`

    switch (parameter) {
      case CONFIG_PARAMETERS.SCRIPT_GENERATION:
        return readConfig<string>(configKey, SYMLINK_SETTINGS_DEFAULTS[parameter])
      case CONFIG_PARAMETERS.GITIGNORE_SERVICE_FILES:
        return readConfig<boolean>(configKey, SYMLINK_SETTINGS_DEFAULTS[parameter])
      case CONFIG_PARAMETERS.HIDE_SERVICE_FILES:
      case CONFIG_PARAMETERS.HIDE_SYMLINK_CONFIGS:
        return readConfig<boolean>(configKey, SYMLINK_SETTINGS_DEFAULTS[parameter])
    }
  } catch {
    // Return package.json defaults on error
    return SYMLINK_SETTINGS_DEFAULTS[parameter]
  }
}
