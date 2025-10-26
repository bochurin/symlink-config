import { ifDirectoryNotExists, ifNotExists } from '../if-blocks'

export function createDirectory(
  targetDir: string,
  targetOS: 'windows' | 'unix',
): string[] {
  return targetOS === 'windows'
    ? ifNotExists(
        targetDir,
        [`echo Creating directory ${targetDir}`, `mkdir "${targetDir}"`],
        targetOS,
      )
    : ifDirectoryNotExists(
        targetDir,
        [`echo "Creating directory ${targetDir}"`, `mkdir -p "${targetDir}"`],
        targetOS,
      )
}
