import * as vscode from 'vscode'
import * as state from '../shared/state'
import { init as initGitignore } from '../managers/gitignore-file'
import { init as initNextConfig } from '../managers/next-config-file'
import { init as initCurrentConfig } from '../managers/current-config'
import { init as initFileExclude } from '../managers/file-exclude-settings'
import { setWatchers } from './set-watchers'
import { CONFIG } from '../shared/constants'
import { read as readSymlinkSettings } from '../managers/symlink-settings'

let isInitialized = false

export async function initializeExtension(): Promise<(() => void) | undefined> {
  if (isInitialized || !vscode.workspace.workspaceFolders) {
    return
  }

  const workspaceRoot =
    vscode.workspace.workspaceFolders[0].uri.fsPath.split('\\').join('/') + '/'
  const workspaceName = vscode.workspace.workspaceFolders?.[0]?.name
  state.setWorkspaceRoot(workspaceRoot)
  state.setWorkspaceName(workspaceName)
  console.log('ROOT:', workspaceRoot)
  //TODO: calculate the shortest path from workspace folders and get it as project root,
  // save it to the workspace (only!) settings, and ask user to modify it if they need.
  // watch workspace folders changes and ask to check if the root path is still correct

  const watchWorkspace = readSymlinkSettings(
    CONFIG.SYMLINK_CONFIG.WATCH_WORKSPACE,
  )
  await Promise.all([
    initFileExclude(),
    initGitignore(),
    ...(watchWorkspace ? [initNextConfig(), initCurrentConfig()] : []),
  ])

  const dispose = setWatchers()
  isInitialized = true

  return dispose
}

export function resetInitialization() {
  isInitialized = false
}
