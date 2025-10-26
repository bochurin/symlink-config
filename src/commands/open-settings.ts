import { executeCommand } from '@shared/vscode'

export function openSettings(): void {
  executeCommand('workbench.action.openWorkspaceSettings', 'symlink-config')
}
