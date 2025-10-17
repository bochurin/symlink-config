import * as vscode from 'vscode'
import { setWorkspaceRoot, setWorkspaceName, disposeWatchers } from '../state'
import { log } from '../shared/log'
import { findCommonPath } from '../shared/file-ops'
import { makeWatchers } from './make-watchers'
import { managersInit } from './managers-init'
import { makeManagers } from './make-managers'

let isInitialized = false

export async function init(): Promise<(() => void) | undefined> {
  if (isInitialized || !vscode.workspace.workspaceFolders) {
    return
  }

  const { workspaceRoot, workspaceName } = await calculateAndSetProjectRoot()

  setWorkspaceRoot(workspaceRoot)
  setWorkspaceName(workspaceName)
  log(`Project root: ${workspaceRoot}`)

  // Create all managers objects
  makeManagers()

  // Establish all the watchers and subscribe managers to them
  makeWatchers()

  // Perform initialization functions of all managers
  await managersInit()

  isInitialized = true

  return disposeWatchers
}

export function reset() {
  disposeWatchers()
  isInitialized = false
}

async function calculateAndSetProjectRoot(): Promise<{
  workspaceRoot: string
  workspaceName: string
}> {
  const config = vscode.workspace.getConfiguration('symlink-config')
  const existingRoot = config.get<string>('projectRoot')
  const workspaceName =
    vscode.workspace.name || vscode.workspace.workspaceFolders?.[0]?.name || 'workspace'

  if (existingRoot) {
    return { workspaceRoot: existingRoot, workspaceName }
  }

  // Calculate and save new project root
  const folders = vscode.workspace.workspaceFolders!
  const folderPaths = folders.map((f) => f.uri.fsPath)
  const normalizedPath = findCommonPath(folderPaths)

  await config.update(
    'projectRoot',
    normalizedPath,
    vscode.ConfigurationTarget.Workspace,
  )
  return { workspaceRoot: normalizedPath, workspaceName }
}


