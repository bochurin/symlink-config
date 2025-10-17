import * as vscode from 'vscode'

export function toFsPath(pathOrUri: string | vscode.Uri): string {
  return typeof pathOrUri === 'string' ? pathOrUri : pathOrUri.fsPath
}