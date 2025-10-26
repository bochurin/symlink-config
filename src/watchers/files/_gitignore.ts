import { log } from '@log'
import { queue } from '@queue'
import { FILE_NAMES, WATCHERS } from '@shared/constants'
import { isRootFile } from '@shared/file-ops'
import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { getWorkspaceRoot, registerWatcher } from '@state'

import { useGitignoreManager } from '@/src/managers/files/_gitignore'

export function gitignoreWatcher() {
  const gitignoreManager = useGitignoreManager()
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
        return queue(() => gitignoreManager.handleEvent(events))
      },
    },
  })
  registerWatcher(WATCHERS.GITIGNORE, watcher)
  log('Gitignore watcher registered')
}
