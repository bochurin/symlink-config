import * as vscode from 'vscode'

export function warning(message: string) {
  vscode.window.showWarningMessage(message)
}
