import { SETTINGS, MANAGERS } from '@shared/constants'
import { createManager } from '@shared/factories/manager'
import { log } from '@shared/log'
import { registerManager } from '@state'
import { make } from './make'

export function filesSettingsManager() {
  log('Files settings manager registered')
  const manager = createManager({
    objectNameCallback: () => SETTINGS.FILES.SECTION,
    makeCallback: make,
  })
  registerManager(MANAGERS.SYMLINK_CONFIG_SETTINGS, manager)
}
