import { executeCommand } from '@shared/vscode'

export async function collapseAll() {
  await executeCommand('workbench.actions.treeView.symlink-config.collapseAll')
}
