import * as vscode from 'vscode'
import * as state from './state'
import { SymlinkTreeProvider } from '../views/symlink-tree'
import { registerCommands } from './register-commands'
import { init, reset } from './ini'

export async function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('symlink-config', { log: true })
  state.setOutputChannel(outputChannel)
  context.subscriptions.push(outputChannel)

  state.log('Extension activated')

  const treeProvider = new SymlinkTreeProvider()
  vscode.window.createTreeView('symlink-config', {
    treeDataProvider: treeProvider,
  })

  state.setTreeProvider(treeProvider)
  registerCommands(context, treeProvider)

  const dispose = await init()
  if (dispose) {
    context.subscriptions.push({ dispose })
  }

  const workspaceListener = vscode.workspace.onDidChangeWorkspaceFolders(
    async () => {
      state.log('Workspace folders changed, reinitializing...')
      reset()
      const dispose = await init()
      if (dispose) {
        context.subscriptions.push({ dispose })
      }
    },
  )

  context.subscriptions.push(workspaceListener)
}

export function deactivate() {
  state.log('Extension deactivated')
  state.disposeWatchers()
}
