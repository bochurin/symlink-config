import { useFileWatcher, FileEventType } from '../hooks/use-file-watcher'
import { handleEvent as handleGitignoreEvent } from '../managers/gitignore-file'
import { FILE_NAMES, WATCHERS } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { queue, registerWatcher } from '../shared/state'

export function gitignoreWatcher() {
  const { log } = require('../shared/state')
  log('Gitignore watcher registered')
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.GITIGNORE}`,
    filters: (event) => isRootFile(event.uri),
    events: {
      on: [FileEventType.Modified, FileEventType.Deleted],
      handlers: (events) => {
        log('.gitignore file changed')
        return queue(() => handleGitignoreEvent())
      },
    },
  })
  registerWatcher(WATCHERS.GITIGNORE, watcher)
}
