import * as vscode from 'vscode'
import { setOutputChannel, setTreeProvider, disposeWatchers } from './state'
import { log } from '../shared/log'
import { SymlinkTreeProvider } from '../views/symlink-tree'
import { registerCommands } from './register-commands'
import { init, reset } from './ini'

export async function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('symlink-config', { log: true })
  setOutputChannel(outputChannel)
  context.subscriptions.push(outputChannel)

  log('Extension activated')

  const treeProvider = new SymlinkTreeProvider()
  vscode.window.createTreeView('symlink-config', {
    treeDataProvider: treeProvider,
  })

  setTreeProvider(treeProvider)
  registerCommands(context, treeProvider)

  const dispose = await init()
  if (dispose) {
    context.subscriptions.push({ dispose })
  }

  const workspaceListener = vscode.workspace.onDidChangeWorkspaceFolders(
    async () => {
      log('Workspace folders changed, reinitializing...')
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
  log('Extension deactivated')
  disposeWatchers()
}
