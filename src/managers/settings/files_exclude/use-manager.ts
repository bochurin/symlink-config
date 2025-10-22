import { SETTINGS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import { makeCallback } from './callbacks/make'
import { readCallback } from './callbacks/read'
import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'
import { needsRegenerateCallback } from './callbacks/needs-regenerate'
import { ExclusionPart } from './enums'
import { generateCallback } from './callbacks/generate'
import { writeCallback } from './callbacks/write'
import { FilesExcludeManager } from './types'

export function useFilesExcludeManager(): FilesExcludeManager {
  const manager = createManager({
    objectNameCallback: () => SETTINGS.FILES.SECTION,
    readCallback: readCallback,
    writeCallback: writeCallback,
    makeCallback: makeCallback,
    needsRegenerateCallback: needsRegenerateCallback,
    generateCallback: generateCallback,
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
