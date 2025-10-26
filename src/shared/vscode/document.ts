import * as vscode from 'vscode'

export async function openDocument(filePath: string): Promise<void> {
  const document = await vscode.workspace.openTextDocument(filePath)
  await vscode.window.showTextDocument(document)
}

export async function showDocument(filePath: string): Promise<void> {
  const document = await vscode.workspace.openTextDocument(filePath)
  await vscode.window.showTextDocument(document)
}

export async function openTextDocument(filePath: string): Promise<vscode.TextDocument> {
  return await vscode.workspace.openTextDocument(filePath)
}

export async function showTextDocument(document: vscode.TextDocument): Promise<void> {
  await vscode.window.showTextDocument(document)
}