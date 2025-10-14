import * as vscode from 'vscode'
import * as state from '../shared/state'
import { SymlinkTreeProvider } from '../views/symlink-tree'
import { registerCommands } from './register-commands'
import { initializeExtension, resetInitialization } from './initialize'

export async function activate(context: vscode.ExtensionContext) {
  console.log('🔗 Symlink Config extension is now active!')

  const treeProvider = new SymlinkTreeProvider()
  vscode.window.createTreeView('symlink-config', {
    treeDataProvider: treeProvider,
  })

  state.setTreeProvider(treeProvider)
  registerCommands(context, treeProvider)

  const dispose = await initializeExtension()
  if (dispose) {
    context.subscriptions.push({ dispose })
  }

  const workspaceListener = vscode.workspace.onDidChangeWorkspaceFolders(
    async () => {
      resetInitialization()
      const dispose = await initializeExtension()
      if (dispose) {
        context.subscriptions.push({ dispose })
      }
    },
  )

  context.subscriptions.push(workspaceListener)
}

export function deactivate() {}
