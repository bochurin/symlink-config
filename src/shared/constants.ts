// File names
export const FILE_NAMES = {
  SYMLINK_CONFIG: 'symlink.config.json',
  NEXT_SYMLINK_CONFIG: 'next.symlink.config.json',
  CURRENT_SYMLINK_CONFIG: 'current.symlink.config.json',
  APPLY_SYMLINKS_BAT: 'apply.symlinks.config.bat',
  APPLY_SYMLINKS_SH: 'apply.symlinks.config.sh',
  CLEAR_SYMLINKS_BAT: 'clear.symlinks.config.bat',
  CLEAR_SYMLINKS_SH: 'clear.symlinks.config.sh',
  RUN_ADMIN_BAT: 'admin.symlink.config.bat',
  GITIGNORE: '.gitignore',
} as const

// Configuration sections and parameters
export const CONFIG_SECTIONS = {
  SYMLINK_CONFIG: 'symlink-config',
  FILES: 'files',
} as const

export const CONFIG_PARAMETERS = {
  GITIGNORE_SERVICE_FILES: 'gitignoreServiceFiles',
  HIDE_SERVICE_FILES: 'hideServiceFiles',
  HIDE_SYMLINK_CONFIGS: 'hideSymlinkConfigs',
  SCRIPT_GENERATION: 'scriptGeneration',
  SYMLINK_PATH_MODE: 'symlinkPathMode',
  EXCLUDE: 'exclude',
} as const

export const SYMLINK_SETTINGS_DEFAULTS = {
  [CONFIG_PARAMETERS.SCRIPT_GENERATION]: 'auto' as const,
  [CONFIG_PARAMETERS.SYMLINK_PATH_MODE]: 'relative' as const,
  [CONFIG_PARAMETERS.GITIGNORE_SERVICE_FILES]: true,
  [CONFIG_PARAMETERS.HIDE_SERVICE_FILES]: false,
  [CONFIG_PARAMETERS.HIDE_SYMLINK_CONFIGS]: false,
} as const
