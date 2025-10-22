import { SETTINGS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import {
  SymlinkConfigSettingsProperty,
  SymlinkConfigSettingsPropertyValue,
  SymlinkConfigSettingsManager,
} from './types'
import { readCallback } from './callbacks/read'
import { makeCallback } from './callbacks/make'
import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'

export function useSymlinkConfigManager(): SymlinkConfigSettingsManager {
  const manager = createManager<
    | SymlinkConfigSettingsPropertyValue
    | Record<string, SymlinkConfigSettingsPropertyValue>
  >({
    objectNameCallback: () => SETTINGS.SYMLINK_CONFIG.SECTION,
    readCallback: readCallback,
    makeCallback: makeCallback,
  })

  return {
    objectName: () => manager.objectName(),
    handleEvent: async (event: SettingsEvent) =>
      await manager.handleEvent({ event }),
    read: (property?: SymlinkConfigSettingsProperty) =>
      manager.read!({ property }),
  }
}
