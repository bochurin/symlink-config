import {
  SettingsEvent,
  useSettingsWatcher,
} from '../shared/hooks/use-settings-watcher'
import { handleEvent as handleSymlinkConfigEvent } from '../managers/symlink-settings'
import { SETTINGS, WATCHERS } from '../shared/constants'
import { registerWatcher } from '../extension/state'
import { log } from '../shared/log'
import { queue } from '../extension/queue'

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
        onChange: (event: SettingsEvent) => {
          log(
            `Setting changed: ${event.parameter} (${event.oldValue} → ${event.value})`,
          )
          return queue(() => handleSymlinkConfigEvent(event))
        },
      },
    },
  })
  registerWatcher(WATCHERS.SYMLINK_SETTINGS, watcher)
}
