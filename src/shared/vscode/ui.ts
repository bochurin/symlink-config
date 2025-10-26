import * as vscode from 'vscode'

export function createStatusBarItem(
  alignment: vscode.StatusBarAlignment,
  priority?: number,
): vscode.StatusBarItem {
  return vscode.window.createStatusBarItem(alignment, priority)
}