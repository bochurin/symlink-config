import { useFileWatcher, FileWatchEvent } from '../hooks/use-file-watcher'
import { handleEvent as handleCurrentConfigEvent } from '../managers/current-config'
import { FILE_NAMES, WATCHERS } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { getTreeProvider, queue, registerWatcher } from '../shared/state'

export function currentConfigWatcher() {
  const treeProvider = getTreeProvider()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.CURRENT_SYMLINK_CONFIG}`,
    filters: (uri, event) => isRootFile(uri),
    events: {
      on: [
        FileWatchEvent.Created,
        FileWatchEvent.Modified,
        FileWatchEvent.Deleted,
      ],
      handlers: (events) => {
        queue(() => handleCurrentConfigEvent(events[0].event))
        treeProvider?.refresh()
      },
    },
  })
  registerWatcher(WATCHERS.CURRENT_CONFIG, watcher)
}
