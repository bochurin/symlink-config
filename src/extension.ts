import * as vscode from 'vscode'

import { setWorkspaceRoot } from './shared/state'

import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as workspaceManager from './managers/workspace'

import { setWatchers } from './set-watchers'

export function activate(context: vscode.ExtensionContext) {
  console.log('🔗 Symlink Config extension is now active!')

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0] //TODO: Intelenge it
  if (!workspaceFolder) {
    console.log('No workspace folder found')
    return
  }

  setWorkspaceRoot(workspaceFolder.uri.fsPath)

  nextConfigManager.init()
  
  const config = vscode.workspace.getConfiguration('symlink-config')
  const manageGitignore = config.get<boolean>('manageGitignore', true)
  const hideServiceFiles = config.get<boolean>('hideServiceFiles', false)
  
  if (manageGitignore) {
    gitignoreManager.init()
  }
  
  if (hideServiceFiles) {
    workspaceManager.init()
  }

  const dispose = setWatchers()
  context.subscriptions.push({ dispose })
}

export function deactivate() {}
