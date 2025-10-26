
import { SETTINGS } from '@shared/constants'
import { fullPath, relative, dirname } from '@shared/file-ops'

import { osSpecificPath } from './os-specific-path'

import { useSymlinkConfigManager } from '@/src/managers'

export function sourcePath(
  source: string,
  target: string,
  workspaceRoot: string,
  targetOS: 'windows' | 'unix',
): { sourcePath: string; symlinkSource: string } {
  const settingsManager = useSymlinkConfigManager()
  const pathMode = String(
    settingsManager.read(SETTINGS.SYMLINK_CONFIG.SYMLINK_PATH_MODE),
  )

  const sourceRelative = source.startsWith('@') ? source.slice(1) : source
  const sourcePath = fullPath(workspaceRoot, sourceRelative)

  const resolvedPath =
    pathMode === 'absolute'
      ? sourcePath
      : relative(dirname(fullPath(workspaceRoot, target)), sourcePath)

  return {
    sourcePath: osSpecificPath(sourceRelative, targetOS),
    symlinkSource: osSpecificPath(resolvedPath, targetOS),
  }
}
