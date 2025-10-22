import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { FILE_NAMES, WATCHERS } from '@shared/constants'
import { isRootFile } from '@shared/file-ops'
import { getTreeProvider, getWorkspaceRoot, registerWatcher } from '@state'
import { log } from '@shared/log'
import { queue } from '@queue'
import { useGitignoreManager } from '@/src/managers/files/_gitignore'
import { useCurrentSymlinkConfigManager } from '@/src/managers'

export function currentConfigWatcher() {
  const _gitignoreFileManager = useGitignoreManager()
  const currentConfigManager = useCurrentSymlinkConfigManager()

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
        queue(() => currentConfigManager.handleEvent(events))
        queue(() => _gitignoreFileManager.handleEvent(events))
        treeProvider?.refresh()
      },
    },
  })
  registerWatcher(WATCHERS.CURRENT_SYMLINK_CONFIG, watcher)
  log('Current config watcher registered')
}
