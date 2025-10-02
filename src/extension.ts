import * as vscode from 'vscode'
import { setWatchers } from './set-watchers'

export function activate(context: vscode.ExtensionContext) {
  console.log('🔗 Symlink Config extension is now active!')

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (!workspaceFolder) {
    console.log('No workspace folder found')
    return
  }

  const dispose = setWatchers(workspaceFolder.uri.fsPath)
  context.subscriptions.push({ dispose })
}

export function deactivate() {}
