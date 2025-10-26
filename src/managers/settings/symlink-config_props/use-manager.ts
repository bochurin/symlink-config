import { SETTINGS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import { log } from '@log'
import {
  SymlinkConfigSettingsProperty,
  SymlinkConfigSettingsPropertyValue,
  SymlinkConfigSettingsManager,
} from './types'
import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'
import { readCallback } from './callbacks/read'
import { makeCallback } from './callbacks/make'
import { writeCallback } from './callbacks/write'
import { afterpartyCallback } from './callbacks/afterparty'

export function useSymlinkConfigManager(): SymlinkConfigSettingsManager {
  const manager = createManager<
    | SymlinkConfigSettingsPropertyValue
    | Record<string, SymlinkConfigSettingsPropertyValue>
  >({
    objectNameCallback: () => SETTINGS.SYMLINK_CONFIG.SECTION,
    readCallback,
    makeCallback,
    writeCallback,
    afterpartyCallback,
    logCallback: log,
  })

  return {
    objectName: () => manager.objectName(),
    handleEvent: async (event: SettingsEvent) =>
      await manager.handleEvent({ event }),
    read: (property?: SymlinkConfigSettingsProperty) =>
      manager.read!({ property }),
  }
}
