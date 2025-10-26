import { SETTINGS } from '@shared/constants'

import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'

export type SymlinkConfigSettingsProperty =
  | typeof SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE
  | typeof SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES
  | typeof SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS
  | typeof SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES
  | typeof SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS
  | typeof SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION
  | typeof SETTINGS.SYMLINK_CONFIG.SYMLINK_PATH_MODE
  | typeof SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION_MODE
  | typeof SETTINGS.SYMLINK_CONFIG.CONTINUOUS_MODE
  | typeof SETTINGS.SYMLINK_CONFIG.SILENT
  | typeof SETTINGS.SYMLINK_CONFIG.MAX_LOG_ENTRIES

export type SymlinkConfigSettingsPropertyValue =
  (typeof SETTINGS.SYMLINK_CONFIG.DEFAULT)[keyof typeof SETTINGS.SYMLINK_CONFIG.DEFAULT]

export interface SymlinkConfigSettingsManager {
  objectName: () => string
  handleEvent: (event: SettingsEvent) => Promise<void>
  read: (
    property?: SymlinkConfigSettingsProperty,
  ) =>
    | SymlinkConfigSettingsPropertyValue
    | Record<string, SymlinkConfigSettingsPropertyValue>
}
