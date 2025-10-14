import {
  symlinkConfigsWatcher,
  nextConfigWatcher,
  currentConfigWatcher,
  gitignoreWatcher,
  symlinksWatcher,
  settingsWatcher,
} from '../watchers'

import { SETTINGS, WATCHERS } from '../shared/constants'
import { read as readSymlinkSettings } from '../managers/symlink-settings'
import { disposeWatchers } from '../shared/state'

export function makeWatchers() {
  disposeWatchers()

  settingsWatcher()

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
}
