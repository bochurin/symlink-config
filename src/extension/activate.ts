import * as vscode from 'vscode'
import { setOutputChannel, setTreeProvider, disposeWatchers } from '@state'
import { log } from '@shared/log'
import { SymlinkTreeProvider, ScriptCodeLensProvider } from '@views'
import { registerCommands } from './register-commands'
import { init, reset } from './ini'
import { isRunningAsAdmin } from '@shared/admin-detection'

export async function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('symlink-config', {
    log: true,
  })
  setOutputChannel(outputChannel)
  context.subscriptions.push(outputChannel)

  log('Extension activated')

  const treeProvider = new SymlinkTreeProvider()
  const treeView = vscode.window.createTreeView('symlink-config', {
    treeDataProvider: treeProvider,
  })
  
  // Update view name with admin status
  const isAdmin = await isRunningAsAdmin()
  if (isAdmin) {
    treeView.title = '🔑 SYMLINK-CONFIG'
  }

  setTreeProvider(treeProvider)
  context.subscriptions.push(treeView)
  registerCommands(context, treeProvider)

  const codeLensProvider = new ScriptCodeLensProvider()
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(['bat', 'shellscript'], codeLensProvider)
  )

  const dispose = await init()
  if (dispose) {
    context.subscriptions.push({ dispose })
  }

  const workspaceListener = vscode.workspace.onDidChangeWorkspaceFolders(
    async () => {
      log('Workspace folders changed, checking project root...')
      await checkProjectRootAfterWorkspaceChange()
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

async function checkProjectRootAfterWorkspaceChange() {
  const config = vscode.workspace.getConfiguration('symlink-config')
  const existingRoot = config.get<string>('projectRoot')

  if (existingRoot) {
    const choice = await vscode.window.showInformationMessage(
      'Workspace folders changed. Check if project root is still correct?',
      'Check Now',
      'Keep Current',
    )

    if (choice === 'Check Now') {
      // This will trigger the project root calculation in init()
      await config.update(
        'projectRoot',
        undefined,
        vscode.ConfigurationTarget.Workspace,
      )
    }
  }
}
