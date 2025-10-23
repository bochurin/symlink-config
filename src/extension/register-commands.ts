import * as vscode from 'vscode'
import {
  applyConfig,
  cancelSymlinkCreation,
  cleanConfig,
  clearLogsCommand,
  collapseAll,
  openSymlinkConfig,
  refreshManagers,
  runScript,
  selectSymlinkSource,
  selectSymlinkTarget,
} from '@commands'

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
      applyConfig,
    ),
    vscode.commands.registerCommand(
      'symlink-config.cleanConfiguration',
      cleanConfig,
    ),
    vscode.commands.registerCommand('symlink-config.collapseAll', collapseAll),
    vscode.commands.registerCommand(
      'symlink-config.refreshManagers',
      refreshManagers,
    ),
    vscode.commands.registerCommand(
      'symlink-config.clearLogs',
      clearLogsCommand,
    ),
    vscode.commands.registerCommand('symlink-config.runScript', runScript),
  ]

  context.subscriptions.push(...commands)
}
