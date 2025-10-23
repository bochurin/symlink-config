import packageJson from '@/package.json'

const props = packageJson.contributes.configuration.properties

const SECTION = 'symlink-config'
const PROPERTIES = {
  WATCH_WORKSPACE: 'watchWorkspace',
  GITIGNORE_SERVICE_FILES: 'gitignoreServiceFiles',
  GITIGNORE_SYMLINKS: 'gitignoreSymlinks',
  HIDE_SERVICE_FILES: 'hideServiceFiles',
  HIDE_SYMLINK_CONFIGS: 'hideSymlinkConfigs',
  SCRIPT_GENERATION: 'scriptGenerationOS',
  SYMLINK_PATH_MODE: 'symlinkPathMode',
  SCRIPT_GENERATION_MODE: 'scriptGenerationMode',
  PROJECT_ROOT: 'projectRoot',
  MAX_LOG_ENTRIES: 'maxLogEntries',
} as const

export const SETTINGS = {
  SYMLINK_CONFIG: {
    SECTION,
    ...PROPERTIES,
    DEFAULT: {
      WATCH_WORKSPACE:
        props[`${SECTION}.${PROPERTIES.WATCH_WORKSPACE}`].default,
      GITIGNORE_SERVICE_FILES:
        props[`${SECTION}.${PROPERTIES.GITIGNORE_SERVICE_FILES}`].default,
      GITIGNORE_SYMLINKS:
        props[`${SECTION}.${PROPERTIES.GITIGNORE_SYMLINKS}`].default,
      HIDE_SERVICE_FILES:
        props[`${SECTION}.${PROPERTIES.HIDE_SERVICE_FILES}`].default,
      HIDE_SYMLINK_CONFIGS:
        props[`${SECTION}.${PROPERTIES.HIDE_SYMLINK_CONFIGS}`].default,
      SCRIPT_GENERATION:
        props[`${SECTION}.${PROPERTIES.SCRIPT_GENERATION}`].default,
      SYMLINK_PATH_MODE:
        props[`${SECTION}.${PROPERTIES.SYMLINK_PATH_MODE}`].default,
      SCRIPT_GENERATION_MODE:
        props[`${SECTION}.${PROPERTIES.SCRIPT_GENERATION_MODE}`].default,
      MAX_LOG_ENTRIES:
        props[`${SECTION}.${PROPERTIES.MAX_LOG_ENTRIES}`].default,
    },
  },
  FILES: {
    SECTION: 'files',
    EXCLUDE: 'exclude',
    DEFAULT: false,
  },
} as const
