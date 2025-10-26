import * as vscode from 'vscode'

export async function showOpenDialog(
  options?: vscode.OpenDialogOptions,
): Promise<vscode.Uri[] | undefined> {
  return await vscode.window.showOpenDialog(options)
}