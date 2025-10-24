import { FileEvent } from '@/src/shared/hooks/use-file-watcher'
import { GitignoringPart } from './enums'

export interface GitignoreManager {
  objectName: () => string
  handleEvent: (events: FileEvent | FileEvent[]) => Promise<void>
  make: (mode?: GitignoringPart) => void
  read: () => Record<string, { spacing: string; active: boolean }>
  init: () => Promise<void>
}
