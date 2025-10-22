import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { isSymlink } from '@shared/file-ops'
import { registerWatcher } from '@state'
import { log } from '@shared/log'
import { queue } from '@queue'
import { WATCHERS } from '@shared/constants'
import { useCurrentSymlinkConfigManager } from '@/src/managers'

export function symlinksWatcher() {
  const currentConfigManager = useCurrentSymlinkConfigManager()

  log('Symlinks watcher registered')
  const watcher = useFileWatcher({
    pattern: '**/*',
    debounce: 500,
    filters: (event) => isSymlink(event.uri),
    events: {
      on: [FileEventType.Created, FileEventType.Deleted],
      handlers: (events) => {
        const details = events
          .map((e) => `${e.eventType} ${e.uri.fsPath}`)
          .join(', ')
        log(`Symlinks: ${details}`)
        return queue(() => currentConfigManager.handleEvent(events))
      },
    },
  })
  registerWatcher(WATCHERS.SYMLINKS, watcher)
}
