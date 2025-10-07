import * as vscode from 'vscode'

import { setWorkspaceRoot } from './state'

import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as fileExcludeManager from './managers/file-exclude'

import { setWatchers } from './set-watchers'
import { SymlinkTreeProvider } from './views/tree-provider'
import { createSymlink, selectSymlinkTarget, cancelSymlinkCreation } from './commands/create-symlink'

let isInitialized = false

async function initializeExtension(treeProvider?: any) {
  if (isInitialized || !vscode.workspace.workspaceFolders) {
    return
  }

  const workspaceRoot =
    vscode.workspace.workspaceFolders[0].uri.fsPath.split('\\').join('/') + '/' // [0] is the root workspace folder (if multiple, we'll need to handle that]

  setWorkspaceRoot(workspaceRoot)
  console.log('ROOT:', workspaceRoot)

  await Promise.all([
    fileExcludeManager.init(), //
    gitignoreManager.init(), //
    nextConfigManager.init() //
  ])

  const dispose = setWatchers(treeProvider)
  isInitialized = true
  return dispose
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('🔗 Symlink Config extension is now active!')

  // Register tree view
  const treeProvider = new SymlinkTreeProvider()
  vscode.window.createTreeView('symlink-config', { treeDataProvider: treeProvider })

  // Register openSettings command
  const openSettingsCommand = vscode.commands.registerCommand('symlink-config.openSettings', () => {
    vscode.commands.executeCommand('workbench.action.openSettings', 'symlink-config')
  })
  context.subscriptions.push(openSettingsCommand)

  // Register toggleView command
  const toggleViewCommand = vscode.commands.registerCommand('symlink-config.toggleView', () => {
    treeProvider.toggleViewMode()
  })
  context.subscriptions.push(toggleViewCommand)

  // Register createSymlink commands
  const createSymlinkCommand = vscode.commands.registerCommand('symlink-config.createSymlink', createSymlink)
  const selectTargetCommand = vscode.commands.registerCommand('symlink-config.selectSymlinkTarget', selectSymlinkTarget)
  const cancelCommand = vscode.commands.registerCommand('symlink-config.cancelSymlinkCreation', cancelSymlinkCreation)
  context.subscriptions.push(createSymlinkCommand, selectTargetCommand, cancelCommand)

  // Try to initialize immediately
  const dispose = await initializeExtension(treeProvider)
  if (dispose) {
    context.subscriptions.push({ dispose })
  }

  // Listen for workspace folder changes
  const workspaceListener = vscode.workspace.onDidChangeWorkspaceFolders(
    async () => {
      isInitialized = false // Reset to allow reinitialization
      const dispose = await initializeExtension(treeProvider)
      if (dispose) {
        context.subscriptions.push({ dispose })
      }
    }
  )

  context.subscriptions.push(workspaceListener)
}

export function deactivate() {}
