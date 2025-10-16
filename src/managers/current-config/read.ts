import { readFile } from '../../shared/file-ops'
import { getWorkspaceRoot } from '../../extension/state'
import { FILE_NAMES } from '../../shared/constants'

export function read(): string {
  const content = readFile(getWorkspaceRoot(), FILE_NAMES.CURRENT_SYMLINK_CONFIG)
  return content
}
