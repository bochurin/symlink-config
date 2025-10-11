// File names
export const FILE_NAMES = {
  SYMLINK_CONFIG: 'symlink.config.json',
  NEXT_SYMLINK_CONFIG: 'next.symlink.config.json',
  CURRENT_SYMLINK_CONFIG: 'current.symlink.config.json',
  APPLY_SYMLINKS_BAT: 'apply.symlinks.config.bat',
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
  EXCLUDE: 'exclude',
} as const
