import { FILE_NAMES } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import { FileEvent } from '@/src/shared/hooks/use-file-watcher'
import { GitignoringPart } from './enums'
import { read } from './read'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'
import { generate } from './generate'
import { write } from './write'

export function useGitignoreManager() {
  const manager = createManager({
    objectNameCallback: () => FILE_NAMES.GITIGNORE,
    readCallback: read,
    writeCallback: write,
    makeCallback: make,
    needsRegenerateCallback: needsRegenerate,
    generateCallback: generate,
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
