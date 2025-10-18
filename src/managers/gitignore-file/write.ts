import { writeFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'
import { FILE_NAMES } from '@shared/constants'

export async function write(content: string) {
  await writeFile(getWorkspaceRoot(), FILE_NAMES.GITIGNORE, content)
}
