import {
  SettingsEvent,
  useSettingsWatcher,
} from '@shared/hooks/use-settings-watcher'
import { SETTINGS, WATCHERS } from '@shared/constants'
import { registerWatcher } from '@state'
import { log } from '@shared/log'
import { queue } from '@queue'
import { useFilesSettingsManager } from '@/src/managers/settings/files_exclude'

export function filesSettingsWatcher() {
  const filesSettingsManager = useFilesSettingsManager()

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
          return queue(() => filesSettingsManager.handleEvent(event))
        },
      },
    },
  })
  registerWatcher(WATCHERS.FILES_SETTINGS, watcher)
}
