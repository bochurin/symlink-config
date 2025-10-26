import { log } from '@log'
import { FILE_NAMES } from '@shared/constants'
import { createManager } from '@shared/factories/manager'

import { generateCallback } from './callbacks/generate'
import { readCallback } from './callbacks/read'
import { writeCallback } from './callbacks/write'
import { CurrentSymlinkConfigManager } from './types'

import { FileEvent } from '@/src/shared/hooks/use-file-watcher'

export function useCurrentSymlinkConfigManager(): CurrentSymlinkConfigManager {
  const manager = createManager({
    objectNameCallback: () => FILE_NAMES.CURRENT_SYMLINK_CONFIG,
    readCallback,
    writeCallback,
    generateCallback,
    logCallback: log,
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
