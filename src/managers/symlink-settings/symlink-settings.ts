import { SETTINGS } from '../../shared/constants'
import { MANAGERS } from '../../shared/constants/managers'
import { createManager } from '../../shared/factories/manager'
import { SettingsEvent } from '../../shared/hooks/use-settings-watcher'
import { log } from '../../shared/log'
import { registerManager } from '../../state'
import { SymlinkSettingsValue } from './types'

export function symlinkSettingsManager() {
  log('Symlink settings manager registered')
  const manager = createManager<
    Record<string, SymlinkSettingsValue>,
    SettingsEvent
  >({
    readCallback: async () => ({}),
    makeCallback: async (initialContent) => initialContent,
    name: SETTINGS.SYMLINK_CONFIG.SECTION,
  })
  registerManager(MANAGERS.SYMLINK_CONFIG_SETTINGS, manager)
}
