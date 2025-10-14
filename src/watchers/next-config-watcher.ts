import { useFileWatcher, FileWatchEvent } from '../hooks/use-file-watcher'
import { handleEvent as handleNextConfigEvent } from '../managers/next-config-file'
import { FILE_NAMES } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { getTreeProvider, queue, registerWatcher } from '../shared/state'

export function createNextConfigWatcher() {
  const treeProvider = getTreeProvider()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.NEXT_SYMLINK_CONFIG}`,
    filter: (uri, event) => isRootFile(uri),
    events: {
      on: [FileWatchEvent.Modified, FileWatchEvent.Deleted],
      handler: (events) => {
        queue(() => handleNextConfigEvent(events[0].event))
        treeProvider?.refresh()
      },
    },
  })
  registerWatcher(watcher)
}
