import * as fs from 'fs'
import * as vscode from 'vscode'
import { fullPath } from '../path/full-path'

export function statFile(rootPath: string | vscode.Uri, file: string | vscode.Uri): fs.Stats {
  return fs.statSync(fullPath(rootPath, file))
}
