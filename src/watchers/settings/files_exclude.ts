import {
  SettingsEvent,
  useSettingsWatcher,
} from '@shared/hooks/use-settings-watcher'
import { SETTINGS, WATCHERS } from '@shared/constants'
import { registerWatcher } from '@state'
import { log } from '@shared/log'
import { queue } from '@queue'
import { useFilesExcludeManager } from '@/src/managers/settings/files_exclude'

export function filesSettingsWatcher() {
  const filesExcludeManager = useFilesExcludeManager()

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
          return queue(() => filesExcludeManager.handleEvent(event))
        },
      },
    },
  })
  registerWatcher(WATCHERS.FILES_SETTINGS, watcher)
}
