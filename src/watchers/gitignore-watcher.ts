import { useFileWatcher, FileWatchEvent } from '../hooks/use-file-watcher'
import { handleEvent as handleGitignoreEvent } from '../managers/gitignore-file'
import { FILE_NAMES } from '../shared/constants'
import { isRootFile } from '../shared/file-ops'
import { queue, registerWatcher } from '../shared/state'

export function createGitignoreWatcher() {
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.GITIGNORE}`,
    filter: (uri, event) => isRootFile(uri),
    events: {
      on: [FileWatchEvent.Modified, FileWatchEvent.Deleted],
      handler: (events) => queue(() => handleGitignoreEvent()),
    },
  })
  registerWatcher(watcher)
}
