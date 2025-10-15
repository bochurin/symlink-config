import { FileEventType } from '../../hooks/use-file-watcher'
import { handleEvent } from './handle-event'

export async function init() {
  await handleEvent(FileEventType.Modified)
}
