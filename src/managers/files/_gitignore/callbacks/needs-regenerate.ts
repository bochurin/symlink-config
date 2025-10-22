import { SETTINGS } from '@shared/constants'
import { FileEvent } from '@shared/hooks/use-file-watcher'
import { log } from '@shared/log'
import { useSymlinkConfigManager } from '@managers'

export function needsRegenerateCallback(params?: {
  events?: FileEvent | FileEvent[]
}): boolean {
  const events = params?.events
  const eventType = events
    ? Array.isArray(events)
      ? events[0].eventType
      : events?.eventType
    : undefined

  const settingsManager = useSymlinkConfigManager()

  const gitignoreServiceFiles = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
  )
  const gitignoreSymlinkConfigs = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS,
  )

  const result = gitignoreServiceFiles || gitignoreSymlinkConfigs //TODO: relly check if it is needed to regenerate it

  log(
    `.gitignore needsRegenerate: event=${eventType || 'none'}, result=${result}`,
  )
  return result as boolean
}
