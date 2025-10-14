import { init as initGitignore } from '../managers/gitignore-file'
import { init as initNextConfig } from '../managers/next-config-file'
import { init as initCurrentConfig } from '../managers/current-config'
import { init as initFileExclude } from '../managers/file-exclude-settings'
import { CONFIG } from '../shared/constants'
import { read as readSymlinkSettings } from '../managers/symlink-settings'

export async function initManagers() {
  const watchWorkspace = readSymlinkSettings(
    CONFIG.SYMLINK_CONFIG.WATCH_WORKSPACE,
  )
  await Promise.all([
    initFileExclude(),
    initGitignore(),
    ...(watchWorkspace ? [initNextConfig(), initCurrentConfig()] : []),
  ])
}
