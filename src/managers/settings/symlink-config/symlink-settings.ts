import { SETTINGS, MANAGERS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import { SettingsEvent } from '@shared/hooks/use-settings-watcher'
import { log } from '@shared/log'
import { registerManager } from '@state'
import { SettingsPropertyValue } from './types'
import { read } from './read'

export function symlinkSettingsManager() {
  log('Symlink settings manager registered')
  const manager = createManager<
    SettingsPropertyValue | Record<string, SettingsPropertyValue>,
    SettingsEvent
  >({
    readCallback: read,
    makeCallback: async () => undefined,
    objectName: SETTINGS.SYMLINK_CONFIG.SECTION,
  })
  registerManager(MANAGERS.SYMLINK_CONFIG_SETTINGS, manager)
}
