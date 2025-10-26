import { log } from '@log'
import { findCommonPath } from '@shared/file-ops'
import { setWorkspaceRoot, setWorkspaceName, disposeWatchers, setInitialized } from '@state'
import * as vscode from 'vscode'

import { makeWatchers } from './make-watchers'
import { managersInit } from './managers-init'



export async function init(): Promise<(() => void) | undefined> {
  if (!vscode.workspace.workspaceFolders) {
    return
  }

  const { workspaceRoot, workspaceName } = await calculateAndSetProjectRoot()

  setWorkspaceRoot(workspaceRoot)
  setWorkspaceName(workspaceName)
  log(`Project root: ${workspaceRoot}`)

  // Establish all the watchers and subscribe managers to them
  makeWatchers()

  // Perform initialization functions of all managers
  await managersInit()

  setInitialized(true)

  return disposeWatchers
}

export function reset() {
  disposeWatchers()
  setInitialized(false)
}

async function calculateAndSetProjectRoot(): Promise<{
  workspaceRoot: string
  workspaceName: string
}> {
  const config = vscode.workspace.getConfiguration('symlink-config')
  const existingRoot = config.get<string>('projectRoot')
  const workspaceName =
    vscode.workspace.name ||
    vscode.workspace.workspaceFolders?.[0]?.name ||
    'workspace'

  if (existingRoot) {
    return { workspaceRoot: existingRoot, workspaceName }
  }

  // Calculate and save new project root
  const folders = vscode.workspace.workspaceFolders!
  const folderPaths = folders.map((f) => f.uri.fsPath)
  const normalizedPath = findCommonPath(folderPaths)

  try {
    await config.update(
      'projectRoot',
      normalizedPath,
      vscode.ConfigurationTarget.Workspace,
    )
  } catch (error) {
    log(`Warning: Could not save project root to workspace settings: ${error}`)
    // Continue without saving to workspace settings
  }
  return { workspaceRoot: normalizedPath, workspaceName }
}
