import { init as initNextConfig } from '@managers/next-config-file'
import { init as initCurrentConfig } from '@managers/current-config'

import { SETTINGS } from '@shared/constants'
import { useSymlinkConfigManager } from '@/src/managers'
import { log } from '@shared/log'
import { useFilesExcludeManager } from '../managers/settings/files_exclude'
import { useGitignoreManager as use_gitignoreFileManager } from '../managers/files/_gitignore'

export async function managersInit(force?: boolean) {
  force = force || false
  const symlinkConfigSettingsManager = useSymlinkConfigManager()

  const gitignoreServiceFiles = symlinkConfigSettingsManager.read(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
  )
  const watchWorkspace = symlinkConfigSettingsManager.read(
    SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
  )

  log('Initializing managers...')
  const filesExcludeManager = useFilesExcludeManager()
  const gitignoreMnager = use_gitignoreFileManager()
  await Promise.all([
    filesExcludeManager.init(),
    ...(force || gitignoreServiceFiles ? [gitignoreMnager.init()] : []),
    ...(force || watchWorkspace ? [initNextConfig(), initCurrentConfig()] : []),
  ])
  log('Managers initialized')
}
