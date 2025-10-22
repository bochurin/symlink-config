import { writeFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'
import { FILE_NAMES } from '@shared/constants'

export async function writeCallback(params?: { content?: string }) {
  const content = params?.content

  if (content) {
    await writeFile(
      getWorkspaceRoot(),
      FILE_NAMES.CURRENT_SYMLINK_CONFIG,
      content,
    )
  }
}
