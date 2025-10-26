import { getWorkspaceRoot } from '@state'

import { FILE_NAMES } from '@shared/constants'
import { join } from '@shared/file-ops'
import { openTextDocument, showTextDocument, showError } from '@shared/vscode'

export async function openSymlinkConfig(treeItem: any) {
  const workspaceRoot = getWorkspaceRoot()

  // Use targetPath from tree item, fallback to root
  const targetFolder = treeItem?.targetPath || ''
  const configPath = join(
    workspaceRoot,
    targetFolder,
    FILE_NAMES.SYMLINK_CONFIG,
  )

  try {
    const document = await openTextDocument(configPath)
    await showTextDocument(document)
  } catch (error) {
    showError(
      `Could not open ${FILE_NAMES.SYMLINK_CONFIG}: ${error}`,
    )
  }
}
