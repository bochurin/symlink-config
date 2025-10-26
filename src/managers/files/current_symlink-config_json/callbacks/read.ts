import { FILE_NAMES } from '@shared/constants'
import { readFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'

export function readCallback(): string {
  const content = readFile(
    getWorkspaceRoot(),
    FILE_NAMES.CURRENT_SYMLINK_CONFIG,
  )
  return content
}
