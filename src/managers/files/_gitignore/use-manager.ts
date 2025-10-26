import { log } from '@log'
import { FILE_NAMES } from '@shared/constants'
import { createManager } from '@shared/factories/manager'

import { generateCallback } from './callbacks/generate'
import { makeCallback } from './callbacks/make'
import { needsRegenerateCallback } from './callbacks/needs-regenerate'
import { readCallback } from './callbacks/read'
import { writeCallback } from './callbacks/write'
import { GitignoringPart } from './enums'
import { GitignoreManager } from './types'

import { FileEvent } from '@/src/shared/hooks/use-file-watcher'

export function useGitignoreManager(): GitignoreManager {
  const manager = createManager({
    objectNameCallback: () => FILE_NAMES.GITIGNORE,
    readCallback,
    writeCallback,
    makeCallback,
    needsRegenerateCallback,
    generateCallback,
    logCallback: log,
  })

  return {
    objectName: () => manager.objectName(),
    handleEvent: async (events: FileEvent | FileEvent[]) =>
      await manager.handleEvent({ events }),
    read: () => manager.read!(),
    make: (mode?: GitignoringPart) => manager.make({ mode }),
    init: async () => await manager.init(),
  }
}
