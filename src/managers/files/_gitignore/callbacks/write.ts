import { writeFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'
import { FILE_NAMES } from '@shared/constants'
import { assembleGitignore } from '@/src/shared/gitignore-ops'

export async function writeCallback(params?: {
  content?: Record<string, { spacing: string; active: boolean }>
}) {
  const entries = params!.content!
  const assembledContent = assembleGitignore(entries)
  await writeFile(getWorkspaceRoot(), FILE_NAMES.GITIGNORE, assembledContent)
}
