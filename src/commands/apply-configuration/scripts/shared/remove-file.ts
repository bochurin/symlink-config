import { ifExists } from './if-blocks'
import { osSpecificPath } from './path'

export function removeFile(
  targetPath: string,
  target: string,
  targetOS: 'windows' | 'unix',
): string[] {
  const formattedPath = osSpecificPath(targetPath, targetOS)

  return ifExists(
    formattedPath,
    targetOS === 'windows'
      ? [
          `echo Removing ${target}`,
          `rmdir "${formattedPath}" 2>nul || del "${formattedPath}" 2>nul`,
        ]
      : [`echo "Removing ${target}"`, `rm -rf "${formattedPath}"`],
    targetOS,
  )
}
