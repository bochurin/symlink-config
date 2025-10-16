import * as vscode from 'vscode'

export function isRootFile(rootPath: string, uri: vscode.Uri) {
  if (!rootPath) return false
  const root = rootPath.split('\\').join('/')
  const uriDir = uri.fsPath.split('\\').slice(0, -1).join('/') + '/'
  return uriDir === root
}
