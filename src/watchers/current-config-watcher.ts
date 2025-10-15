import { useFileWatcher, FileEventType } from '../hooks/use-file-watcher'
import { handleEvent as handleCurrentConfigEvent } from '../managers/current-config'
import { FILE_NAMES, WATCHERS } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { getTreeProvider, queue, registerWatcher } from '../shared/state'

export function currentConfigWatcher() {
  const treeProvider = getTreeProvider()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.CURRENT_SYMLINK_CONFIG}`,
    filters: (event) => isRootFile(event.uri),
    events: {
      on: [
        FileEventType.Created,
        FileEventType.Modified,
        FileEventType.Deleted,
      ],
      handlers: (events) => {
        queue(() => handleCurrentConfigEvent(events[0].event))
        treeProvider?.refresh()
      },
    },
  })
  registerWatcher(WATCHERS.CURRENT_CONFIG, watcher)
}
