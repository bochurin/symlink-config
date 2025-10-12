import { CONFIG_PARAMETERS } from '../../shared/constants'

export type SymlinkSettingsParameter =
  | typeof CONFIG_PARAMETERS.GITIGNORE_SERVICE_FILES
  | typeof CONFIG_PARAMETERS.HIDE_SERVICE_FILES
  | typeof CONFIG_PARAMETERS.HIDE_SYMLINK_CONFIGS
  | typeof CONFIG_PARAMETERS.SCRIPT_GENERATION
  | typeof CONFIG_PARAMETERS.SYMLINK_PATH_MODE

export type SymlinkSettingsValue = string | boolean | undefined
