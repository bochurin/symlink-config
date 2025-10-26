import { log } from '@log'
import { useSymlinkConfigManager } from '@managers'
import { queue } from '@queue'
import { SETTINGS, WATCHERS } from '@shared/constants'
import {
  SettingsEvent,
  useSettingsWatcher,
} from '@shared/hooks/use-settings-watcher'
import { registerWatcher } from '@state'

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
