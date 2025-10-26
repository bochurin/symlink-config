import { cleanConfig } from '@commands'
import { log } from '@log'
import { queue } from '@queue'
import { FILE_NAMES, WATCHERS, SETTINGS } from '@shared/constants'
import { isRootFile } from '@shared/file-ops'
import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { getTreeProvider, getWorkspaceRoot, registerWatcher } from '@state'

import { useCurrentSymlinkConfigManager, useSymlinkConfigManager } from '@/src/managers'
import { useGitignoreManager } from '@/src/managers/files/_gitignore'

export function currentConfigWatcher() {
  const _gitignoreFileManager = useGitignoreManager()
  const currentConfigManager = useCurrentSymlinkConfigManager()
  const settingsManager = useSymlinkConfigManager()

  const treeProvider = getTreeProvider()
  const workspaceRoot = getWorkspaceRoot()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.CURRENT_SYMLINK_CONFIG}`,
    filters: (event) => isRootFile(workspaceRoot, event.uri),
    events: {
      on: [
        FileEventType.Created,
        FileEventType.Modified,
        FileEventType.Deleted,
      ],
      handlers: async (events) => {
        log(
          `current.symlink-config.json: ${events[0].eventType} at ${events[0].uri.fsPath}`,
        )
        await queue(() => currentConfigManager.handleEvent(events))
        await queue(() => _gitignoreFileManager.handleEvent(events))
        treeProvider?.refresh()
        
        const continuousMode = settingsManager.read(SETTINGS.SYMLINK_CONFIG.CONTINUOUS_MODE)
        if (continuousMode) {
          log('Continuous mode: auto-cleaning configuration...')
          await queue(() => cleanConfig())
        }
      },
    },
  })
  registerWatcher(WATCHERS.CURRENT_SYMLINK_CONFIG, watcher)
  log('Current config watcher registered')
}
