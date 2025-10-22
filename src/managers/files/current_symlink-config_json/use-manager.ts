import { FILE_NAMES } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import { FileEvent } from '@/src/shared/hooks/use-file-watcher'
import { readCallback } from './callbacks/read'
import { generateCallback } from './callbacks/generate'
import { writeCallback } from './callbacks/write'
import { CurrentSymlinkConfigManager } from './types'

export function useCurrentSymlinkConfigManager(): CurrentSymlinkConfigManager {
  const manager = createManager({
    objectNameCallback: () => FILE_NAMES.GITIGNORE,
    readCallback,
    writeCallback,
    generateCallback,
  })

  return {
    objectName: () => manager.objectName(),
    handleEvent: async (events: FileEvent | FileEvent[]) =>
      await manager.handleEvent({ events }),
    read: () => manager.read!(),
    make: () => manager.make(),
    init: async () => await manager.init(),
  }
}
