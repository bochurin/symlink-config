import * as vscode from 'vscode'

export function warning(message: string) {
  vscode.window.showWarningMessage(message)
}

export async function warningChoice(
  message: string,
  ...choices: string[]
): Promise<string | undefined> {
  return await vscode.window.showWarningMessage(message, { modal: true }, ...choices)
}
