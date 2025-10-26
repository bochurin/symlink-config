import { log } from '@log'
import { useNextSymlinkConfigManager } from '@managers'
import { queue } from '@queue'
import { FILE_NAMES, WATCHERS } from '@shared/constants'
import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { getTreeProvider, registerWatcher } from '@state'

export function symlinkConfigsWatcher() {
  const nextConfigManager = useNextSymlinkConfigManager()
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
          const details = events
            .map((e) => `${e.eventType} ${e.uri.fsPath}`)
            .join(', ')
          log(`symlink-config.json: ${details}`)
          return queue(() => nextConfigManager.handleEvent(events))
        },
        (events) => treeProvider?.refresh(),
      ],
    },
  })
  registerWatcher(WATCHERS.SYMLINK_CONFIGS, watcher)
}
