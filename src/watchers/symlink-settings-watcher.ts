import { useSettingsWatcher } from '../hooks/use-settings-watcher'
import { handleEvent as handleSymlinkConfigEvent } from '../managers/symlink-settings'
import { SETTINGS, WATCHERS } from '../shared/constants'
import { queue, registerWatcher, log } from '../shared/state'

export function symlinkSettingsWatcher() {
  log('Symlink settings watcher registered')
  const watcher = useSettingsWatcher({
    sections: {
      section: SETTINGS.SYMLINK_CONFIG.SECTION,
      handlers: {
        parameters: [
          SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
          SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
          SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
          SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
        ],
        onChange: (section, parameter, payload) => {
          log(`Setting changed: ${parameter} (${payload.old_value} → ${payload.value})`)
          return queue(() => handleSymlinkConfigEvent(section, parameter, payload))
        },
      },
    },
  })
  registerWatcher(WATCHERS.SYMLINK_SETTINGS, watcher)
}
