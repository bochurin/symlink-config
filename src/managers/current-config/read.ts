import { readFile } from '../../shared/file-ops'
import { FILE_NAMES } from '../../shared/constants'

export function read(): string {
  const content = readFile(FILE_NAMES.CURRENT_SYMLINK_CONFIG)
  return content
}
