import { log } from '@log'
import { SETTINGS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'

import { generateCallback } from './callbacks/generate'
import { makeCallback } from './callbacks/make'
import { needsRegenerateCallback } from './callbacks/needs-regenerate'
import { readCallback } from './callbacks/read'
import { writeCallback } from './callbacks/write'
import { ExclusionPart } from './enums'
import { FilesExcludeManager } from './types'

import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'

export function useFilesExcludeManager(): FilesExcludeManager {
  const manager = createManager({
    objectNameCallback: () => SETTINGS.FILES.SECTION,
    readCallback: readCallback,
    writeCallback: writeCallback,
    makeCallback: makeCallback,
    needsRegenerateCallback: needsRegenerateCallback,
    generateCallback: generateCallback,
    logCallback: log,
  })

  return {
    objectName: () => manager.objectName(),
    handleEvent: async (event: SettingsEvent) =>
      await manager.handleEvent({ event }),
    read: () => manager.read!(),
    make: (mode?: ExclusionPart) => manager.make({ mode }),
    init: async () => await manager.init(),
  }
}
