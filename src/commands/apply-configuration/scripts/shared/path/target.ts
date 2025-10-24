import { osSpecificPath } from './os-specific-path'

export function targetPath(
  targetPath: string,
  workspaceRoot: string,
  targetOS: 'windows' | 'unix',
): string {
  return osSpecificPath(targetPath, targetOS)
}
