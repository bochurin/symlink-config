import {
  SettingsEvent,
  useSettingsWatcher,
} from '../hooks/use-settings-watcher'
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
        onChange: (event: SettingsEvent) => {
          log(
            `files.exclude changed: ${Object.keys(event.value || {}).length} patterns`,
          )
          return queue(() => handleFileExcludeEvent(event))
        },
      },
    },
  })
  registerWatcher(WATCHERS.FILES_SETTINGS, watcher)
}
