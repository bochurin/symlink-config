import { useFileWatcher, FileEventType } from '../hooks/use-file-watcher'
import { handleEvent as handleNextConfigEvent } from '../managers/next-config-file'
import { FILE_NAMES, WATCHERS } from '../shared/constants'
import { getTreeProvider, queue, registerWatcher } from '../shared/state'

export function symlinkConfigsWatcher() {
  const { log } = require('../shared/state')
  log('Symlink configs watcher registered')
  const treeProvider = getTreeProvider()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.SYMLINK_CONFIG}`,
    events: {
      on: [
        FileEventType.Created,
        FileEventType.Modified,
        FileEventType.Deleted,
      ],
      handlers: [
        (events) => {
          log(`symlink-config.json changed (${events.length} events)`)
          return queue(() => handleNextConfigEvent(FileEventType.Modified))
        },
        (events) => treeProvider?.refresh(),
      ],
    },
  })
  registerWatcher(WATCHERS.SYMLINK_CONFIGS, watcher)
}
