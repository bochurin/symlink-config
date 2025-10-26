import { applyConfig } from '@commands'
import { log } from '@log'
import { useNextSymlinkConfigManager, useSymlinkConfigManager } from '@managers'
import { queue } from '@queue'
import { FILE_NAMES, WATCHERS, SETTINGS } from '@shared/constants'
import { isRootFile } from '@shared/file-ops'
import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { getTreeProvider, getWorkspaceRoot, registerWatcher } from '@state'

export function nextConfigWatcher() {
  const nextConfigManager = useNextSymlinkConfigManager()
  const settingsManager = useSymlinkConfigManager()
  log('Next config watcher registered')
  const treeProvider = getTreeProvider()
  const workspaceRoot = getWorkspaceRoot()
  const watcher = useFileWatcher({
    pattern: `**/${FILE_NAMES.NEXT_SYMLINK_CONFIG}`,
    filters: (event) => isRootFile(workspaceRoot, event.uri),
    events: {
      on: [FileEventType.Modified, FileEventType.Deleted],
      handlers: async (events) => {
        log(
          `next.symlink-config.json: ${events[0].eventType} at ${events[0].uri.fsPath}`,
        )
        await queue(() => nextConfigManager.handleEvent(events))
        treeProvider?.refresh()
        
        const continuousMode = settingsManager.read(SETTINGS.SYMLINK_CONFIG.CONTINUOUS_MODE)
        if (continuousMode) {
          log('Continuous mode: auto-applying configuration...')
          await queue(() => applyConfig())
        }
      },
    },
  })
  registerWatcher(WATCHERS.NEXT_SYMLINK_CONFIG, watcher)
}
