import { useFileWatcher, FileWatchEvent } from '../hooks/use-file-watcher'
import { handleEvent as handleCurrentConfigEvent } from '../managers/current-config'
import { isSymlink } from '../shared/file-ops'
import { queue, registerWatcher } from '../shared/state'

export function createSymlinksWatcher() {
  const watcher = useFileWatcher({
    pattern: '**/*',
    debounce: 500,
    filter: (uri, event) => isSymlink(uri),
    events: {
      on: [FileWatchEvent.Created, FileWatchEvent.Deleted],
      handler: (events) => queue(() => handleCurrentConfigEvent('modified')),
    },
  })
  registerWatcher(watcher)
}
