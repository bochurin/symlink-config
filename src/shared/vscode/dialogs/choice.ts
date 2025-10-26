import * as vscode from 'vscode'

export async function choice(
  message: string,
  ...choices: string[]
): Promise<string | undefined> {
  return await vscode.window.showInformationMessage(
    message,
    { modal: true },
    ...choices,
  )
}
