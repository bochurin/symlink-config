import { useConfigWatcher } from '../hooks/use-config-watcher'
import { handleEvent as handleFileExcludeEvent } from '../managers/file-exclude-settings'
import { handleEvent as handleSymlinkConfigEvent } from '../managers/symlink-settings'
import { CONFIG } from '../shared/constants'
import { queue, registerWatcher } from '../shared/state'

export function createConfigWatcher() {
  const watcher = useConfigWatcher({
    sections: [
      {
        section: CONFIG.SYMLINK_CONFIG.SECTION,
        configs: {
          parameters: [
            CONFIG.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
            CONFIG.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
            CONFIG.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
            CONFIG.SYMLINK_CONFIG.WATCH_WORKSPACE,
          ],
          onChange: (section, parameter, payload) =>
            queue(() => handleSymlinkConfigEvent(section, parameter, payload)),
        },
      },
      {
        section: CONFIG.FILES.SECTION,
        configs: {
          parameters: CONFIG.FILES.EXCLUDE,
          onChange: () => queue(() => handleFileExcludeEvent()),
        },
      },
    ],
  })
  registerWatcher(watcher)
}
