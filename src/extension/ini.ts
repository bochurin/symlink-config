import * as vscode from 'vscode'
import { setWorkspaceRoot, setWorkspaceName, disposeWatchers } from './state'
import { log } from '../shared/log'
import { makeWatchers } from './make-watchers'
import { managersInit } from './managers-init'
import { makeManagers } from './make-managers'

let isInitialized = false

export async function init(): Promise<(() => void) | undefined> {
  if (isInitialized || !vscode.workspace.workspaceFolders) {
    return
  }

  const workspaceRoot =
    vscode.workspace.workspaceFolders[0].uri.fsPath.split('\\').join('/') + '/'
  const workspaceName = vscode.workspace.workspaceFolders?.[0]?.name
  setWorkspaceRoot(workspaceRoot)
  setWorkspaceName(workspaceName)
  log(`Workspace root: ${workspaceRoot}`)
  //TODO: calculate the shortest path from workspace folders and get it as project root,
  // save it to the workspace (only!) settings, and ask user to modify it if they need.
  // watch workspace folders changes and ask to check if the root path is still correct

  //Create all managers objects
  makeManagers()

  //Establich all the watchers and sumscribe managers to them
  makeWatchers()

  //Performe initialization functions of all managers
  await managersInit()

  isInitialized = true

  return disposeWatchers
}

export function reset() {
  disposeWatchers()
  isInitialized = false
}
