import { useFileWatcher, FileEventType } from '../shared/hooks/use-file-watcher'
import { handleEvent as handleCurrentConfigEvent } from '../managers/current-config'
import { FILE_NAMES, WATCHERS } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { getTreeProvider, queue, registerWatcher, log } from '../shared/state'

export function currentConfigWatcher() {
  log('Current config watcher registered')
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
        log(
          `current.symlink-config.json: ${events[0].event} at ${events[0].uri.fsPath}`,
        )
        queue(() => handleCurrentConfigEvent(events[0].event))
        treeProvider?.refresh()
      },
    },
  })
  registerWatcher(WATCHERS.CURRENT_CONFIG, watcher)
}
