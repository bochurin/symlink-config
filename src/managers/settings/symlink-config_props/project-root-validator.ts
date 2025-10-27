import { log } from '@log'
import { findCommonPath, pathExists } from '@shared/file-ops'
import { info } from '@shared/vscode'
import * as vscode from 'vscode'

export interface ProjectRootValidationResult {
  workspaceRoot: string
  workspaceName: string
  wasRebased: boolean
  reason?: string
}

export function validateProjectRoot(): ProjectRootValidationResult {
  const config = vscode.workspace.getConfiguration('symlink-config')
  const settingsRoot = config.get<string>('projectRoot')
  const workspaceName =
    vscode.workspace.name ||
    vscode.workspace.workspaceFolders?.[0]?.name ||
    'workspace'

  const folders = vscode.workspace.workspaceFolders!
  const folderPaths = folders.map((f) => f.uri.fsPath)
  const calculatedRoot = findCommonPath(folderPaths)

  // Case 1: No previously saved path - rebase silently with logging only
  if (!settingsRoot) {
    log('No project root configured - using calculated root')
    log(`Project root: ${calculatedRoot}`)

    return {
      workspaceRoot: calculatedRoot,
      workspaceName,
      wasRebased: true,
      reason: 'No project root configured'
    }
  }

  // Case 2: Check if saved path is valid (one of workspace folders or common path)
  const isValidPath = folderPaths.includes(settingsRoot) || settingsRoot === calculatedRoot
  
  if (!isValidPath) {
    log(`Invalid project root: ${settingsRoot} is not a workspace folder or common path`)
    log(`Using calculated root: ${calculatedRoot}`)
    info(`Project root rebased from ${settingsRoot} to ${calculatedRoot}`)
    
    return {
      workspaceRoot: calculatedRoot,
      workspaceName,
      wasRebased: true,
      reason: 'Invalid project root path'
    }
  }

  // Existing root is valid
  return {
    workspaceRoot: settingsRoot,
    workspaceName,
    wasRebased: false
  }
}
