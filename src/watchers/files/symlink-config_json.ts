import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { useNextSymlinkConfigManager } from '@managers'
import { FILE_NAMES, WATCHERS } from '@shared/constants'
import { getTreeProvider, registerWatcher } from '@state'
import { log } from '@shared/log'
import { queue } from '@queue'

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
