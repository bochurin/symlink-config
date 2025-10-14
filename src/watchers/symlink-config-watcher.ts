import { useFileWatcher, FileWatchEvent } from '../hooks/use-file-watcher'
import { handleEvent as handleNextConfigEvent } from '../managers/next-config-file'
import { FILE_NAMES } from '../shared/constants'
import { getTreeProvider, queue, registerWatcher } from '../shared/state'

export function createSymlinkConfigWatcher() {
  const treeProvider = getTreeProvider()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.SYMLINK_CONFIG}`,
    events: {
      on: [
        FileWatchEvent.Created,
        FileWatchEvent.Modified,
        FileWatchEvent.Deleted,
      ],
      handler: [
        (events) => queue(() => handleNextConfigEvent(FileWatchEvent.Modified)),
        (events) => treeProvider?.refresh(),
      ],
    },
  })
  registerWatcher(watcher)
}
