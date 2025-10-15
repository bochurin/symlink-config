import { useFileWatcher, FileEventType } from '../hooks/use-file-watcher'
import { handleEvent as handleCurrentConfigEvent } from '../managers/current-config'
import { isSymlink } from '../shared/file-ops'
import { queue, registerWatcher } from '../shared/state'
import { WATCHERS } from '../shared/constants'

export function symlinksWatcher() {
  const watcher = useFileWatcher({
    pattern: '**/*',
    debounce: 500,
    filters: (event) => isSymlink(event.uri),
    events: {
      on: [FileEventType.Created, FileEventType.Deleted],
      handlers: (events) => queue(() => handleCurrentConfigEvent('modified')),
    },
  })
  registerWatcher(WATCHERS.SYMLINKS, watcher)
}
