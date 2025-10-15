import { useSettingsWatcher } from '../hooks/use-settings-watcher'
import { handleEvent as handleFileExcludeEvent } from '../managers/file-exclude-settings'
import { SETTINGS, WATCHERS } from '../shared/constants'
import { queue, registerWatcher, log } from '../shared/state'

export function filesSettingsWatcher() {
  log('Files settings watcher registered')
  const watcher = useSettingsWatcher({
    sections: {
      section: SETTINGS.FILES.SECTION,
      handlers: {
        parameters: SETTINGS.FILES.EXCLUDE,
        onChange: (section, parameter, payload) => {
          log(`files.exclude changed: ${Object.keys(payload.value || {}).length} patterns`)
          return queue(() => handleFileExcludeEvent())
        },
      },
    },
  })
  registerWatcher(WATCHERS.FILES_SETTINGS, watcher)
}
