// File names
export const FILE_NAMES = {
  SYMLINK_CONFIG: 'symlink-config.json',
  NEXT_SYMLINK_CONFIG: 'next.symlink-config.json',
  CURRENT_SYMLINK_CONFIG: 'current.symlink-config.json',
  APPLY_SYMLINKS_BAT: 'apply.symlink-config.bat',
  APPLY_SYMLINKS_SH: 'apply.symlink-config.sh',
  CLEAR_SYMLINKS_BAT: 'clear.symlink-config.bat',
  CLEAR_SYMLINKS_SH: 'clear.symlink-config.sh',
  RUN_ADMIN_BAT: 'admin.symlink-config.bat',
  GITIGNORE: '.gitignore',
} as const

// Watcher names
export const WATCHERS = {
  SYMLINK_SETTINGS: 'symlinkSettings',
  FILES_SETTINGS: 'filesSettings',
  GITIGNORE: 'gitignore',
  NEXT_CONFIG: 'nextConfig',
  CURRENT_CONFIG: 'currentConfig',
  SYMLINK_CONFIGS: 'symlinkConfigs',
  SYMLINKS: 'symlinks',
} as const

// Configuration structure
export const SETTINGS = {
  SYMLINK_CONFIG: {
    SECTION: 'symlink-config',
    WATCH_WORKSPACE: 'enableFileWatchers',
    GITIGNORE_SERVICE_FILES: 'gitignoreServiceFiles',
    HIDE_SERVICE_FILES: 'hideServiceFiles',
    HIDE_SYMLINK_CONFIGS: 'hideSymlinkConfigs',
    SCRIPT_GENERATION: 'scriptGeneration',
    SYMLINK_PATH_MODE: 'symlinkPathMode',
    MAX_LOG_ENTRIES: 'maxLogEntries',
    DEFAULT: {
      WATCH_WORKSPACE: true,
      GITIGNORE_SERVICE_FILES: true,
      HIDE_SERVICE_FILES: false,
      HIDE_SYMLINK_CONFIGS: false,
      SCRIPT_GENERATION: 'auto' as const,
      SYMLINK_PATH_MODE: 'relative' as const,
      MAX_LOG_ENTRIES: 1000,
    },
  },
  FILES: {
    SECTION: 'files',
    EXCLUDE: 'exclude',
  },
} as const
