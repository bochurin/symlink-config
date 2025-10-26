import { ifExists } from './if-blocks'
// Note: osSpecificPath functionality needs to be implemented using shared abstractions

export function removeFile(
  targetPath: string,
  target: string,
  targetOS: 'windows' | 'unix',
): string[] {
  // TODO: Implement osSpecificPath using shared abstractions
  const formattedPath = targetPath // osSpecificPath(targetPath, targetOS)

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
