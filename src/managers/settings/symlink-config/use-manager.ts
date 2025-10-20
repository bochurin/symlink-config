import { SETTINGS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import {
  SettingsProperty,
  SettingsPropertyValue,
  SymlinkConfigSettingsManager,
} from './types'
import { read } from './read'
import { make } from './make'
import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'

export function useSymlinkConfigSettingsMananger(): SymlinkConfigSettingsManager {
  const manager = createManager<
    SettingsPropertyValue | Record<string, SettingsPropertyValue>
  >({
    objectNameCallback: () => SETTINGS.SYMLINK_CONFIG.SECTION,
    readCallback: read,
    makeCallback: make,
  })

  return {
    objectName: () => manager.objectName(),
    handleEvent: async (event: SettingsEvent) =>
      await manager.handleEvent({ event: event }),
    read: (property?: SettingsProperty) =>
      manager.read!({ property: property }),
  }
}
