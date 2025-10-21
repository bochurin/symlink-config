import { SETTINGS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import {
  SymlinkConfigSettingsProperty,
  SymlinkConfigSettingsPropertyValue,
  SymlinkConfigSettingsManager,
} from './types'
import { read } from './read'
import { make } from './make'
import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'

export function useSymlinkConfigSettingsMananger(): SymlinkConfigSettingsManager {
  const manager = createManager<
    | SymlinkConfigSettingsPropertyValue
    | Record<string, SymlinkConfigSettingsPropertyValue>
  >({
    objectNameCallback: () => SETTINGS.SYMLINK_CONFIG.SECTION,
    readCallback: read,
    makeCallback: make,
  })

  return {
    objectName: () => manager.objectName(),
    handleEvent: async (event: SettingsEvent) =>
      await manager.handleEvent({ event }),
    read: (property?: SymlinkConfigSettingsProperty) =>
      manager.read!({ property }),
  }
}
