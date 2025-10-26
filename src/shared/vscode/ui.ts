import * as vscode from 'vscode'

export function createStatusBarItem(
  alignment: number,
  priority?: number,
): vscode.StatusBarItem {
  return vscode.window.createStatusBarItem(alignment as any, priority)
}

export function createTerminal(
  nameOrOptions: string | any,
): any {
  return vscode.window.createTerminal(nameOrOptions)
}