import { FileWatchEvent } from '../../hooks/use-file-watcher'
import { handleEvent } from './handle-event'

export async function init() {
  await handleEvent(FileWatchEvent.Modified)
}
