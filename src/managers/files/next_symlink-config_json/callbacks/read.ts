import { FILE_NAMES } from '@shared/constants'
import { readFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'

export function readCallback(): string {
  try {
    return readFile(getWorkspaceRoot(), FILE_NAMES.NEXT_SYMLINK_CONFIG)
  } catch {
    return ''
  }
}
