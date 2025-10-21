import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { FILE_NAMES, WATCHERS } from '@shared/constants'
import { isRootFile } from '@shared/file-ops'
import { getWorkspaceRoot, registerWatcher } from '@state'
import { log } from '@shared/log'
import { queue } from '@queue'
import { use_gitignoreManager } from '@/src/managers/files/_gitignore'

export function gitignoreWatcher() {
  const _gitignoreFileManager = use_gitignoreManager()
  const workspaceRoot = getWorkspaceRoot()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.GITIGNORE}`,
    filters: (event) => isRootFile(workspaceRoot, event.uri),
    events: {
      on: [FileEventType.Modified, FileEventType.Deleted],
      handlers: (events) => {
        log(
          `.gitignore changed: ${events.map((e) => `${e.eventType} ${e.uri.fsPath}`).join(', ')}`,
        )
        return queue(() => _gitignoreFileManager.handleEvent(events))
      },
    },
  })
  registerWatcher(WATCHERS.GITIGNORE, watcher)
  log('Gitignore watcher registered')
}
