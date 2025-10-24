import {
  SettingsEvent,
  useSettingsWatcher,
} from '@shared/hooks/use-settings-watcher'
import { SETTINGS, WATCHERS } from '@shared/constants'
import { registerWatcher } from '@state'
import { log } from '@log'
import { queue } from '@queue'
import { useSymlinkConfigManager } from '@managers'

export function symlinkConfigSettingsWatcher() {
  // TODO: Fix manager creation error handling, type compatibility, and method availability
  const settingsManager = useSymlinkConfigManager()

  const watcher = useSettingsWatcher({
    sections: {
      section: SETTINGS.SYMLINK_CONFIG.SECTION,
      handlers: {
        properties: [
          SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
          SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS,
          SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
          SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
          SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
          SETTINGS.SYMLINK_CONFIG.PROJECT_ROOT,
          SETTINGS.SYMLINK_CONFIG.RESET_TO_DEFAULTS,
        ],
        onChange: (event: SettingsEvent) => {
          log(
            `Setting changed: ${event.parameter} (${event.oldValue} → ${event.value})`,
          )
          return queue(() => settingsManager.handleEvent(event))
        },
      },
    },
  })
  registerWatcher(WATCHERS.SYMLINK_CONFIG_SETTINGS, watcher)
  log('Symlink settings watcher registered')
}
