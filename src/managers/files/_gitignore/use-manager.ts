import { FILE_NAMES } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import { FileEvent } from '@/src/shared/hooks/use-file-watcher'
import { log } from '@log'
import { GitignoringPart } from './enums'
import { readCallback } from './callbacks/read'
import { makeCallback } from './callbacks/make'
import { needsRegenerateCallback } from './callbacks/needs-regenerate'
import { generateCallback } from './callbacks/generate'
import { writeCallback } from './callbacks/write'
import { GitignoreManager } from './types'

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
