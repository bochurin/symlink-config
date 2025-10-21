import { SETTINGS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import { make } from './make'
import { read } from './read'
import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'
import { needsRegenerate } from './needs-regenerate'
import { ExclusionPart } from './enums'
import { generate } from './generate'
import { write } from './write'

export function useFilesSettingsManager() {
  const manager = createManager({
    objectNameCallback: () => SETTINGS.FILES.SECTION,
    readCallback: read,
    writeCallback: write,
    makeCallback: make,
    needsRegenerateCallback: needsRegenerate,
    generateCallback: generate,
  })

  return {
    objectName: () => manager.objectName(),
    handleEvent: async (event: SettingsEvent) =>
      await manager.handleEvent({ event }),
    read: () => manager.read!(),
    make: async (mode?: ExclusionPart) => await manager.make({ mode }),
    init: async () => await manager.init(),
  }
}
