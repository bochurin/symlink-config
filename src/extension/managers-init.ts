import { SETTINGS } from '@shared/constants'
import {
  useCurrentSymlinkConfigManager,
  useSymlinkConfigManager,
  useNextSymlinkConfigManager,
} from '@/src/managers'
import { log } from '@log'
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
  const currentConfigManager = useCurrentSymlinkConfigManager()
  const nextConfigManager = useNextSymlinkConfigManager()
  await Promise.all([
    filesExcludeManager.init(),
    ...(force || gitignoreServiceFiles ? [gitignoreMnager.init()] : []),
    ...(force || watchWorkspace
      ? [nextConfigManager.init(), currentConfigManager.init()]
      : []),
  ])
  log('Managers initialized')
}
