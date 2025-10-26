import * as vscode from 'vscode'

export function showError(message: string): void {
  vscode.window.showErrorMessage(message)
}