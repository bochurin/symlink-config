import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { useNextSymlinkConfigManager } from '@managers'
import { FILE_NAMES, WATCHERS } from '@shared/constants'
import { isRootFile } from '@shared/file-ops'
import { getTreeProvider, getWorkspaceRoot, registerWatcher } from '@state'
import { log } from '@shared/log'
import { queue } from '@queue'

export function nextConfigWatcher() {
  const nextConfigManager = useNextSymlinkConfigManager()
  log('Next config watcher registered')
  const treeProvider = getTreeProvider()
  const workspaceRoot = getWorkspaceRoot()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.NEXT_SYMLINK_CONFIG}`,
    filters: (event) => isRootFile(workspaceRoot, event.uri),
    events: {
      on: [FileEventType.Modified, FileEventType.Deleted],
      handlers: (events) => {
        log(
          `next.symlink-config.json: ${events[0].eventType} at ${events[0].uri.fsPath}`,
        )
        queue(() => nextConfigManager.handleEvent(events))
        treeProvider?.refresh()
      },
    },
  })
  registerWatcher(WATCHERS.NEXT_SYMLINK_CONFIG, watcher)
}
