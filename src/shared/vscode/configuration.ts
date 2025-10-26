import * as vscode from 'vscode'

export const ConfigurationTarget = vscode.ConfigurationTarget
export type Uri = vscode.Uri

export function getConfiguration(section?: string): any {
  return vscode.workspace.getConfiguration(section)
}

export function createFileSystemWatcher(
  pattern: string,
  ignoreCreateEvents?: boolean,
  ignoreChangeEvents?: boolean,
  ignoreDeleteEvents?: boolean,
): any {
  return vscode.workspace.createFileSystemWatcher(
    pattern,
    ignoreCreateEvents,
    ignoreChangeEvents,
    ignoreDeleteEvents,
  )
}