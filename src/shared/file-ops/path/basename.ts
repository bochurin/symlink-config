import * as path from 'path'
import * as vscode from 'vscode'
import { toFsPath } from './to-fs-path'

export function basename(pathOrUri: string | vscode.Uri): string {
  return path.basename(toFsPath(pathOrUri))
}
