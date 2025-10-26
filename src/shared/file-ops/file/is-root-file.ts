import * as vscode from 'vscode'
import { normalizePath } from '../path/normalize-path'
import { toFsPath } from '../path/to-fs-path'

export function isRootFile(rootPath: string | vscode.Uri, pathOrUri: string | vscode.Uri) {
  const rootFsPath = toFsPath(rootPath)
  if (!rootFsPath) return false
  const root = normalizePath(rootFsPath, true)
  const fsPath = toFsPath(pathOrUri)
  const uriDir = normalizePath(fsPath.split(/[\\/]/).slice(0, -1).join('/'), true)
  return uriDir === root
}
