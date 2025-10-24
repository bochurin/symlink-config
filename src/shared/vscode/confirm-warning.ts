import * as vscode from 'vscode'

export async function confirmWarning(
  message: string,
  confirmText: string,
): Promise<boolean> {
  const result = await vscode.window.showWarningMessage(
    message,
    { modal: true },
    confirmText,
  )
  return result === confirmText
}
