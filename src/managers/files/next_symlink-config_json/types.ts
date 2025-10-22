import { FileEvent } from '@/src/shared/hooks/use-file-watcher'

export interface NextSymlinkConfigManager {
  objectName: () => string
  handleEvent: (events: FileEvent | FileEvent[]) => Promise<void>
  make: () => void
  read: () => string
  init: () => Promise<void>
}
