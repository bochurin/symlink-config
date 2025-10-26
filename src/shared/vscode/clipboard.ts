import * as vscode from 'vscode'

export async function copyToClipboard(text: string): Promise<void> {
  await vscode.env.clipboard.writeText(text)
}

export async function writeToClipboard(text: string): Promise<void> {
  await vscode.env.clipboard.writeText(text)
}