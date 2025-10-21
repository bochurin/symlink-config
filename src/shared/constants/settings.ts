import packageJson from '@/package.json'

const props = packageJson.contributes.configuration.properties

const SECTION = 'symlink-config'
const PARAMETERS = {
  WATCH_WORKSPACE: 'watchWorkspace',
  GITIGNORE_SERVICE_FILES: 'gitignoreServiceFiles',
  GITIGNORE_SYMLINKS: 'gitignoreSymlinks',
  HIDE_SERVICE_FILES: 'hideServiceFiles',
  HIDE_SYMLINK_CONFIGS: 'hideSymlinkConfigs',
  SCRIPT_GENERATION: 'scriptGeneration',
  SYMLINK_PATH_MODE: 'symlinkPathMode',
  PROJECT_ROOT: 'projectRoot',
  MAX_LOG_ENTRIES: 'maxLogEntries',
} as const

export const SETTINGS = {
  SYMLINK_CONFIG: {
    SECTION,
    ...PARAMETERS,
    DEFAULT: {
      WATCH_WORKSPACE:
        props[`${SECTION}.${PARAMETERS.WATCH_WORKSPACE}`].default,
      GITIGNORE_SERVICE_FILES:
        props[`${SECTION}.${PARAMETERS.GITIGNORE_SERVICE_FILES}`].default,
      GITIGNORE_SYMLINKS:
        props[`${SECTION}.${PARAMETERS.GITIGNORE_SYMLINKS}`].default,
      HIDE_SERVICE_FILES:
        props[`${SECTION}.${PARAMETERS.HIDE_SERVICE_FILES}`].default,
      HIDE_SYMLINK_CONFIGS:
        props[`${SECTION}.${PARAMETERS.HIDE_SYMLINK_CONFIGS}`].default,
      SCRIPT_GENERATION:
        props[`${SECTION}.${PARAMETERS.SCRIPT_GENERATION}`].default,
      SYMLINK_PATH_MODE:
        props[`${SECTION}.${PARAMETERS.SYMLINK_PATH_MODE}`].default,
      MAX_LOG_ENTRIES:
        props[`${SECTION}.${PARAMETERS.MAX_LOG_ENTRIES}`].default,
    },
  },
  FILES: {
    SECTION: 'files',
    EXCLUDE: 'exclude',
    DEFAULT: false,
  },
} as const
