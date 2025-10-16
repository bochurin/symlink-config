import { init as initGitignore } from '../managers/gitignore-file'
import { init as initNextConfig } from '../managers/next-config-file'
import { init as initCurrentConfig } from '../managers/current-config'
import { init as initFileExclude } from '../managers/file-exclude-settings'

import { SETTINGS } from '../shared/constants'
import { read as readSymlinkSettings } from '../managers/symlink-settings'
import { log } from '../shared/log'

export async function managersInit(force?: boolean) {
  force = force || false

  const gitignoreServiceFiles = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
  )
  const watchWorkspace = readSymlinkSettings(
    SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
  )

  log('Initializing managers...')
  await Promise.all([
    initFileExclude(),
    ...(force || gitignoreServiceFiles ? [initGitignore()] : []),
    ...(force || watchWorkspace ? [initNextConfig(), initCurrentConfig()] : []),
  ])
  log('Managers initialized')
}
