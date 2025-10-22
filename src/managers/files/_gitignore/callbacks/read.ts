import { readFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'
import { parseGitignore } from '@shared/gitignore-ops'
import { FILE_NAMES } from '@shared/constants'

export function readCallback(): Record<
  string,
  { spacing: string; active: boolean }
> {
  try {
    const content = readFile(getWorkspaceRoot(), FILE_NAMES.GITIGNORE)
    return parseGitignore(content)
  } catch {
    return {}
  }
}
