import { readFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'
import { FILE_NAMES } from '@shared/constants'

export function readCallback(): string {
  try {
    return readFile(getWorkspaceRoot(), FILE_NAMES.NEXT_SYMLINK_CONFIG)
  } catch {
    return ''
  }
}