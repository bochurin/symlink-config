import * as vscode from 'vscode'

export function info(message: string) {
  vscode.window.showInformationMessage(message)
}
