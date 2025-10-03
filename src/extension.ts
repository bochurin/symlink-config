import * as vscode from 'vscode'

import { setWorkspaceRoot } from './state'

import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'

import { setWatchers } from './set-watchers'

export function activate(context: vscode.ExtensionContext) {
  console.log('🔗 Symlink Config extension is now active!')

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (!workspaceFolder) {
    console.log('No workspace folder found')
    return
  }

  setWorkspaceRoot(workspaceFolder.uri.fsPath)

  nextConfigManager.init()
  gitignoreManager.init()

  const dispose = setWatchers()
  context.subscriptions.push({ dispose })
}

export function deactivate() {}
