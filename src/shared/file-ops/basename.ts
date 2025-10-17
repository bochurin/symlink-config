import * as path from 'path'
import * as vscode from 'vscode'

export function basename(uri: vscode.Uri): string {
  return path.basename(uri.fsPath)
}