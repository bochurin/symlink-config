import { useFileWatcher, FileEventType } from '../shared/hooks/use-file-watcher'
import { handleEvent as handleCurrentConfigEvent } from '../managers/current-config'
import { isSymlink } from '../shared/file-ops'
import { registerWatcher } from '../extension/state'
import { log } from '../shared/log'
import { queue } from '../extension/queue'
import { WATCHERS } from '../shared/constants'

export function symlinksWatcher() {
  log('Symlinks watcher registered')
  const watcher = useFileWatcher({
    pattern: '**/*',
    debounce: 500,
    filters: (event) => isSymlink(event.uri),
    events: {
      on: [FileEventType.Created, FileEventType.Deleted],
      handlers: (events) => {
        const details = events
          .map((e) => `${e.event} ${e.uri.fsPath}`)
          .join(', ')
        log(`Symlinks: ${details}`)
        return queue(() => handleCurrentConfigEvent('modified'))
      },
    },
  })
  registerWatcher(WATCHERS.SYMLINKS, watcher)
}
