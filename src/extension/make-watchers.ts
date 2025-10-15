import {
  symlinkConfigsWatcher,
  nextConfigWatcher,
  currentConfigWatcher,
  gitignoreWatcher,
  symlinksWatcher,
  symlinkSettingsWatcher,
  filesSettingsWatcher,
} from '../watchers'

import { SETTINGS } from '../shared/constants'
import { read as readSymlinkSettings } from '../managers/symlink-settings'
import { disposeWatchers, log } from '../shared/state'

export function makeWatchers() {
  log('Creating watchers...')
  disposeWatchers()

  symlinkSettingsWatcher()

  const hideServiceFiles = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
  )
  const hideSymlinkConfigs = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
  )
  if (hideServiceFiles || hideSymlinkConfigs) filesSettingsWatcher()

  const gitignoreServiceFiles = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
  )
  if (gitignoreServiceFiles) gitignoreWatcher()

  const watchWorkspace = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
  )
  if (watchWorkspace) {
    nextConfigWatcher()
    currentConfigWatcher()
    symlinkConfigsWatcher()
    symlinksWatcher()
  }
  log('Watchers created')
}
