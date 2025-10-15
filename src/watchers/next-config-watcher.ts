import { useFileWatcher, FileEventType } from '../hooks/use-file-watcher'
import { handleEvent as handleNextConfigEvent } from '../managers/next-config-file'
import { FILE_NAMES, WATCHERS } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { getTreeProvider, queue, registerWatcher } from '../shared/state'

export function nextConfigWatcher() {
  const treeProvider = getTreeProvider()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.NEXT_SYMLINK_CONFIG}`,
    filters: (event) => isRootFile(event.uri),
    events: {
      on: [FileEventType.Modified, FileEventType.Deleted],
      handlers: (events) => {
        queue(() => handleNextConfigEvent(events[0].event))
        treeProvider?.refresh()
      },
    },
  })
  registerWatcher(WATCHERS.NEXT_CONFIG, watcher)
}
