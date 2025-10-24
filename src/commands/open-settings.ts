import * as vscode from 'vscode'

export function openSettings(): void {
  vscode.commands.executeCommand('workbench.action.openWorkspaceSettings', 'symlink-config')
}
