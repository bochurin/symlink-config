import {
  SettingsEvent,
  useSettingsWatcher,
} from '../shared/hooks/use-settings-watcher'
import { handleEvent as handleFileExcludeEvent } from '../managers/file-exclude-settings'
import { SETTINGS, WATCHERS } from '../shared/constants'
import { registerWatcher } from '../state'
import { log } from '../shared/log'
import { queue } from '../queue'

export function filesSettingsWatcher() {
  log('Files settings watcher registered')
  const watcher = useSettingsWatcher({
    sections: {
      section: SETTINGS.FILES.SECTION,
      handlers: {
        properties: SETTINGS.FILES.EXCLUDE,
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
