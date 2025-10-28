import { findCommonPath, basename } from '@shared/file-ops'
import {
  SymlinkConfigSettingsProperty,
  useSymlinkConfigManager,
} from '@managers'
import { SETTINGS } from '@shared/constants'
import * as vscode from 'vscode'

export function isWorkspaceRootValid(workspaceRoot: string): boolean {
  const folders = vscode.workspace.workspaceFolders!
  const folderPaths = folders.map((f) => f.uri.fsPath)
  const calculatedRoot = findCommonPath(folderPaths)

  return folderPaths.includes(workspaceRoot) || workspaceRoot === calculatedRoot
}

export function rebase(): string {
  const folders = vscode.workspace.workspaceFolders!
  const folderPaths = folders.map((f) => f.uri.fsPath)
  return findCommonPath(folderPaths)
}

export function getWorkspaceName(): string {
  // First try workspace file name
  if (vscode.workspace.name) {
    return vscode.workspace.name
  }

  // Then try workspace root directory name
  const manager = useSymlinkConfigManager()
  const workspaceRoot = manager.read(
    SETTINGS.SYMLINK_CONFIG.WORKSPACE_ROOT,
  ) as string
  if (workspaceRoot) {
    return basename(workspaceRoot)
  }

  // Fallback to default workspace name
  return 'unknown workspace'
}
