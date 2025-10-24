import * as vscode from 'vscode'

export async function confirm(
  message: string,
  confirmText: string,
): Promise<boolean> {
  const result = await vscode.window.showInformationMessage(
    message,
    { modal: true },
    confirmText,
  )
  return result === confirmText
}
