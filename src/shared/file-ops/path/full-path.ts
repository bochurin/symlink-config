import * as path from 'path'
import * as vscode from 'vscode'
import { normalizePath } from './normalize-path'
import { toFsPath } from './to-fs-path'

export function fullPath(rootPath: string | vscode.Uri, endPath: string | vscode.Uri): string {
  const normalizedRootPath = normalizePath(toFsPath(rootPath))
  const fullPath = path.join(normalizedRootPath, toFsPath(endPath))
  return normalizePath(fullPath)
}
