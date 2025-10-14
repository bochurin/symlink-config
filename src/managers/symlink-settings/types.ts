import { CONFIG } from '../../shared/constants'

export type SymlinkSettingsParameter =
  | typeof CONFIG.SYMLINK_CONFIG.WATCH_WORKSPACE
  | typeof CONFIG.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES
  | typeof CONFIG.SYMLINK_CONFIG.HIDE_SERVICE_FILES
  | typeof CONFIG.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS
  | typeof CONFIG.SYMLINK_CONFIG.SCRIPT_GENERATION
  | typeof CONFIG.SYMLINK_CONFIG.SYMLINK_PATH_MODE

export type SymlinkSettingsValue = string | boolean | undefined
