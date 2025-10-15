import { useSettingsWatcher } from '../hooks/use-settings-watcher'
import { handleEvent as handleFileExcludeEvent } from '../managers/file-exclude-settings'
import { handleEvent as handleSymlinkConfigEvent } from '../managers/symlink-settings'
import { SETTINGS, WATCHERS } from '../shared/constants'
import { queue, registerWatcher } from '../shared/state'

export function settingsWatcher() {
  const watcher = useSettingsWatcher({
    sections: [
      {
        section: SETTINGS.SYMLINK_CONFIG.SECTION,
        handlers: {
          parameters: [
            SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
            SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
            SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
            SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
          ],
          onChange: (section, parameter, payload) =>
            queue(() => handleSymlinkConfigEvent(section, parameter, payload)),
        },
      },
      {
        section: SETTINGS.FILES.SECTION,
        handlers: {
          parameters: SETTINGS.FILES.EXCLUDE,
          onChange: () => queue(() => handleFileExcludeEvent()),
        },
      },
    ],
  })
  registerWatcher(WATCHERS.SETTINGS, watcher)
}
