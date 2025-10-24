import * as vscode from 'vscode'

export async function collapseAll() {
  await vscode.commands.executeCommand('workbench.actions.treeView.symlink-config.collapseAll')
}
