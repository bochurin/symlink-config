import { init as initGitignore } from '../managers/gitignore-file'
import { init as initNextConfig } from '../managers/next-config-file'
import { init as initCurrentConfig } from '../managers/current-config'
import { init as initFileExclude } from '../managers/file-exclude-settings'

import { SETTINGS } from '../shared/constants'
import { read as readSymlinkSettings } from '../managers/symlink-settings'

export async function initManagers() {
  const gitignoreServiceFiles = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
  )
  const watchWorkspace = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
  )
  await Promise.all([
    initFileExclude(),
    ...(gitignoreServiceFiles ? [initGitignore()] : []),
    ...(watchWorkspace ? [initNextConfig(), initCurrentConfig()] : []),
  ])
}
