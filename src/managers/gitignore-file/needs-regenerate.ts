import { SETTINGS } from '../../shared/constants'
import { FileEvent } from '../../shared/hooks/use-file-watcher'
import { log } from '../../shared/log'
import { read as readSymlinkSettings } from '../symlink-settings'

export function needsRegenerate(events?: FileEvent | FileEvent[]): boolean {
  const eventType = Array.isArray(events)
    ? events[0].eventType
    : events?.eventType

  const gitignoreServiceFiles = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
  )
  const gitignoreSymlinkConfigs = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS,
  )

  const result = gitignoreServiceFiles || gitignoreSymlinkConfigs //TODO: relly check if it is needed to regenerate it

  log(
    `.gitignore needsRegenerate: event=${eventType || 'none'}, result=${result}`,
  )
  return result as boolean
}
