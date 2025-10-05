import * as vscode from 'vscode'

import { setWorkspaceRoot } from './shared/state'

import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as fileExcludeManager from './managers/file-exclude'

import { setWatchers } from './set-watchers'

let isInitialized = false

async function initializeExtension() {
  if (isInitialized || !vscode.workspace.workspaceFolders) {
    return
  }

  const workspaceRoot = '.'

  setWorkspaceRoot(workspaceRoot)
  console.log('ROOT:', workspaceRoot)

  await Promise.all([
    fileExcludeManager.init(), //
    gitignoreManager.init(), //
    nextConfigManager.init() //
  ])

  const dispose = setWatchers()
  isInitialized = true
  return dispose
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('🔗 Symlink Config extension is now active!')

  // Try to initialize immediately
  const dispose = await initializeExtension()
  if (dispose) {
    context.subscriptions.push({ dispose })
  }

  // Listen for workspace folder changes
  const workspaceListener = vscode.workspace.onDidChangeWorkspaceFolders(
    async () => {
      isInitialized = false // Reset to allow reinitialization
      const dispose = await initializeExtension()
      if (dispose) {
        context.subscriptions.push({ dispose })
      }
    }
  )

  context.subscriptions.push(workspaceListener)
}

export function deactivate() {}
