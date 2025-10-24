import { useFileWatcher, FileEventType } from '@shared/hooks/use-file-watcher'
import { useNextSymlinkConfigManager } from '@managers'
import { FILE_NAMES, WATCHERS, SETTINGS } from '@shared/constants'
import { isRootFile } from '@shared/file-ops'
import { getTreeProvider, getWorkspaceRoot, registerWatcher } from '@state'
import { readSettings } from '@shared/settings-ops'
import { applyConfig } from '@commands'
import { log } from '@shared/log'
import { queue } from '@queue'

export function nextConfigWatcher() {
  const nextConfigManager = useNextSymlinkConfigManager()
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
        
        const continuousMode = readSettings(SETTINGS.SYMLINK_CONFIG.CONTINUOUS_MODE, false)
        if (continuousMode) {
          log('Continuous mode: auto-applying configuration...')
          await queue(() => applyConfig(true))
        }
      },
    },
  })
  registerWatcher(WATCHERS.NEXT_SYMLINK_CONFIG, watcher)
}
