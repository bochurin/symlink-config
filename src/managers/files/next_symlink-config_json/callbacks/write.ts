import { writeFile } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'
import { FILE_NAMES } from '@shared/constants'

export async function writeCallback(params?: { content?: string; [key: string]: any }): Promise<void> {
  if (params?.content) {
    await writeFile(getWorkspaceRoot(), FILE_NAMES.NEXT_SYMLINK_CONFIG, params.content)
  }
}
