import {
  applyConfig,
  cancelSymlinkCreation,
  cleanConfig,
  clearLogsCommand,
  collapseAll,
  openSettings,
  openSymlinkConfig,
  pickProjectRoot,
  platformTestWorkspace,
  refreshManagers,
  runScript,
  selectSymlinkSource,
  selectSymlinkTarget,
} from '@commands'
import * as vscode from 'vscode'

export function registerCommands(
  context: vscode.ExtensionContext,
  treeProvider: any,
) {
  const commands = [
    vscode.commands.registerCommand(
      'symlink-config.openSettings',
      openSettings,
    ),
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
    vscode.commands.registerCommand(
      'symlink-config.pickProjectRoot',
      pickProjectRoot,
    ),
    vscode.commands.registerCommand(
      'extension.platform.testWorkspace',
      platformTestWorkspace,
    ),
  ]

  context.subscriptions.push(...commands)
}
