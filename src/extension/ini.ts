import * as vscode from 'vscode'
import * as state from '../shared/state'
import { makeWatchers } from './make-watchers'
import { managersInit } from './managers-init'

let isInitialized = false

export async function init(): Promise<(() => void) | undefined> {
  if (isInitialized || !vscode.workspace.workspaceFolders) {
    return
  }

  const workspaceRoot =
    vscode.workspace.workspaceFolders[0].uri.fsPath.split('\\').join('/') + '/'
  const workspaceName = vscode.workspace.workspaceFolders?.[0]?.name
  state.setWorkspaceRoot(workspaceRoot)
  state.setWorkspaceName(workspaceName)
  state.log(`Workspace root: ${workspaceRoot}`)
  //TODO: calculate the shortest path from workspace folders and get it as project root,
  // save it to the workspace (only!) settings, and ask user to modify it if they need.
  // watch workspace folders changes and ask to check if the root path is still correct

  await managersInit()

  makeWatchers()

  isInitialized = true

  return state.disposeWatchers
}

export function reset() {
  state.disposeWatchers()
  isInitialized = false
}
