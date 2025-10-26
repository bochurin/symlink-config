import * as fs from 'fs'
import * as vscode from 'vscode'
import { fullPath } from '../path/full-path'

export function readSymlink(rootPath: string | vscode.Uri, file: string | vscode.Uri): string {
  return fs.readlinkSync(fullPath(rootPath, file))
}
