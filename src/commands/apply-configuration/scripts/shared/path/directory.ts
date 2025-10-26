import { dirname } from '@shared/file-ops'
import { osSpecificPath } from './os-specific-path'

export function directoryPath(
  targetPath: string,
  targetOS: 'windows' | 'unix',
): string {
  return osSpecificPath(dirname(targetPath), targetOS)
}
