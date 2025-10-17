import { useFileWatcher, FileEventType } from '../shared/hooks/use-file-watcher'
import { handleEvent as handleCurrentConfigEvent } from '../managers/current-config'
import { handleEvent as handleGitignoreEvent } from '../managers/gitignore-file'
import { FILE_NAMES, WATCHERS } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { getTreeProvider, getWorkspaceRoot, registerWatcher } from '../state'
import { log } from '../shared/log'
import { queue } from '../queue'

export function currentConfigWatcher() {
  log('Current config watcher registered')
  const treeProvider = getTreeProvider()
  const workspaceRoot = getWorkspaceRoot()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.CURRENT_SYMLINK_CONFIG}`,
    filters: (event) => isRootFile(workspaceRoot, event.uri),
    events: {
      on: [
        FileEventType.Created,
        FileEventType.Modified,
        FileEventType.Deleted,
      ],
      handlers: (events) => {
        log(
          `current.symlink-config.json: ${events[0].eventType} at ${events[0].uri.fsPath}`,
        )
        queue(() => handleCurrentConfigEvent(events))
        queue(() => handleGitignoreEvent(events))
        treeProvider?.refresh()
      },
    },
  })
  registerWatcher(WATCHERS.CURRENT_SYMLINK_CONFIG, watcher)
}
