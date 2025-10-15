import { useSettingsWatcher } from '../hooks/use-settings-watcher'
import { handleEvent as handleFileExcludeEvent } from '../managers/file-exclude-settings'
import { SETTINGS, WATCHERS } from '../shared/constants'
import { queue, registerWatcher } from '../shared/state'

export function filesSettingsWatcher() {
  const watcher = useSettingsWatcher({
    sections: {
      section: SETTINGS.FILES.SECTION,
      handlers: {
        parameters: SETTINGS.FILES.EXCLUDE,
        onChange: () => queue(() => handleFileExcludeEvent()),
      },
    },
  })
  registerWatcher(WATCHERS.FILES_SETTINGS, watcher)
}
