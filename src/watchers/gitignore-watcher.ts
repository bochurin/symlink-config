import { useFileWatcher, FileEventType } from '../shared/hooks/use-file-watcher'
import { handleEvent as handleGitignoreEvent } from '../managers/gitignore-file'
import { FILE_NAMES, WATCHERS } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { queue, registerWatcher, log } from '../shared/state'

export function gitignoreWatcher() {
  log('Gitignore watcher registered')
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.GITIGNORE}`,
    filters: (event) => isRootFile(event.uri),
    events: {
      on: [FileEventType.Modified, FileEventType.Deleted],
      handlers: (events) => {
        log(
          `.gitignore changed: ${events.map((e) => `${e.event} ${e.uri.fsPath}`).join(', ')}`,
        )
        return queue(() => handleGitignoreEvent(events))
      },
    },
  })
  registerWatcher(WATCHERS.GITIGNORE, watcher)
}
