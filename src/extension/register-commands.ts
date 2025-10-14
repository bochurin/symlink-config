import * as vscode from 'vscode'
import {
  selectSymlinkSource,
  selectSymlinkTarget,
  cancelSymlinkCreation,
} from '../commands/create-symlink'
import { openSymlinkConfig } from '../commands/open-symlink-config'
import {
  applyConfiguration,
  cleanConfiguration,
} from '../commands/apply-configuration'
import { collapseAll } from '../commands/tree-operations'

export function registerCommands(
  context: vscode.ExtensionContext,
  treeProvider: any,
) {
  const commands = [
    vscode.commands.registerCommand('symlink-config.openSettings', () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'symlink-config',
      )
    }),
    vscode.commands.registerCommand('symlink-config.toggleView', () => {
      treeProvider.toggleViewMode()
    }),
    vscode.commands.registerCommand(
      'symlink-config.selectSymlinkSource',
      selectSymlinkSource,
    ),
    vscode.commands.registerCommand(
      'symlink-config.selectSymlinkTarget',
      selectSymlinkTarget,
    ),
    vscode.commands.registerCommand(
      'symlink-config.cancelSymlinkCreation',
      cancelSymlinkCreation,
    ),
    vscode.commands.registerCommand(
      'symlink-config.openSymlinkConfig',
      openSymlinkConfig,
    ),
    vscode.commands.registerCommand(
      'symlink-config.applyConfiguration',
      applyConfiguration,
    ),
    vscode.commands.registerCommand(
      'symlink-config.cleanConfiguration',
      cleanConfiguration,
    ),
    vscode.commands.registerCommand('symlink-config.collapseAll', collapseAll),
  ]

  context.subscriptions.push(...commands)
}
