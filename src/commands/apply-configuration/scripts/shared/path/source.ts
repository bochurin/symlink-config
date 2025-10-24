import * as path from 'path'
import { fullPath } from '@shared/file-ops'
import { useSymlinkConfigManager } from '@/src/managers'
import { SETTINGS } from '@shared/constants'
import { osSpecificPath } from './os-specific-path'

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
      : path.relative(path.dirname(fullPath(workspaceRoot, target)), sourcePath)

  return {
    sourcePath: osSpecificPath(sourceRelative, targetOS),
    symlinkSource: osSpecificPath(resolvedPath, targetOS),
  }
}
