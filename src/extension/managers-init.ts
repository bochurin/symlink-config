import { init as initNextConfig } from '@managers/next-config-file'
import { init as initCurrentConfig } from '@managers/current-config'

import { SETTINGS } from '@shared/constants'
import { useSymlinkConfigSettingsMananger } from '@/src/managers'
import { log } from '@shared/log'
import { useFilesSettingsManager } from '../managers/settings/files_exclude'
import { use_gitignoreManager as use_gitignoreFileManager } from '../managers/files/_gitignore'

export async function managersInit(force?: boolean) {
  force = force || false
  const symlinkConfigSettingsManager = useSymlinkConfigSettingsMananger()

  const gitignoreServiceFiles = symlinkConfigSettingsManager.read(
    SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
  )
  const watchWorkspace = symlinkConfigSettingsManager.read(
    SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
  )

  log('Initializing managers...')
  const filesSettingsManager = useFilesSettingsManager()
  const _gitignoreFileMnager = use_gitignoreFileManager()
  await Promise.all([
    filesSettingsManager.init(),
    ...(force || gitignoreServiceFiles ? [_gitignoreFileMnager.init()] : []),
    ...(force || watchWorkspace ? [initNextConfig(), initCurrentConfig()] : []),
  ])
  log('Managers initialized')
}
