import * as path from 'path'
import { osSpecificPath } from './os-specific-path'

export function directoryPath(
  targetPath: string,
  targetOS: 'windows' | 'unix',
): string {
  return osSpecificPath(path.dirname(targetPath), targetOS)
}
