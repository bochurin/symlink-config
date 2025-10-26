import { join } from '@shared/file-ops'

export function removeSymlink(
  target: string,
  workspaceRoot: string,
  isDirectory: boolean,
  targetOS: 'windows' | 'unix',
): string[] {
  const targetPath = join(workspaceRoot, target)
  const removeCmd =
    targetOS === 'windows'
      ? isDirectory
        ? `rmdir /q "${targetPath}"`
        : `del /q "${targetPath}"`
      : `rm -rf "${targetPath}"`

  return targetOS === 'windows'
    ? [
        `if fsutil reparsepoint query "${targetPath}" >nul 2>&1 (`,
        `  echo Removing symlink ${target}`,
        `  ${removeCmd}`,
        `) else (`,
        `  echo Skipping real file/directory ${target}`,
        `)`,
      ]
    : [
        `if [ -L "${targetPath}" ]; then`,
        `  echo "Removing symlink ${target}"`,
        `  ${removeCmd}`,
        `else`,
        `  echo "Skipping real file/directory ${target}"`,
        `fi`,
      ]
}
