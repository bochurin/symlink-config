import * as vscode from 'vscode'
import { getWorkspaceRoot } from '../../state'

export function isRootFile(uri: vscode.Uri) {
  const workspaceRoot = getWorkspaceRoot()
  if (!workspaceRoot) return false
  const root = workspaceRoot.split('\\').join('/')
  const uriDir = uri.fsPath.split('\\').slice(0, -1).join('/') + '/'
  return uriDir === root
}
