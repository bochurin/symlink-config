import { log } from '@log'
import { SETTINGS } from '@shared/constants'
import { disposeWatchers } from '@state'
import {
  symlinkConfigsWatcher,
  nextConfigWatcher,
  currentConfigWatcher,
  gitignoreWatcher,
  symlinksWatcher,
  symlinkConfigSettingsWatcher,
  filesSettingsWatcher,
} from '@watchers'

import { useSymlinkConfigManager } from '@/src/managers'


export function makeWatchers() {
  const settingsManager = useSymlinkConfigManager()

  log('Creating watchers...')
  disposeWatchers()

  symlinkConfigSettingsWatcher()

  const hideServiceFiles = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
  )
  const hideSymlinkConfigs = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
  )
  if (hideServiceFiles || hideSymlinkConfigs) {
    filesSettingsWatcher()
  }

  const gitignoreServiceFiles = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
  )
  if (gitignoreServiceFiles) {
    gitignoreWatcher()
  }

  const watchWorkspace = settingsManager.read(
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
