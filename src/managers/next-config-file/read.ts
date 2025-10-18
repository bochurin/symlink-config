import { readFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'
import { FILE_NAMES } from '@shared/constants'

export function read(): string {
  const content = readFile(getWorkspaceRoot(), FILE_NAMES.NEXT_SYMLINK_CONFIG)
  return content
}
