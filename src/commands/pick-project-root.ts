import * as vscode from 'vscode'
import { writeSettings } from '@shared/settings-ops'
import { SETTINGS } from '@shared/constants'
import { log } from '@shared/log'

export async function pickProjectRoot(): Promise<void> {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    canSelectFiles: false,
    canSelectFolders: true,
    openLabel: 'Select Project Root',
    title: 'Select Project Root Directory'
  }

  const folderUri = await vscode.window.showOpenDialog(options)
  
  if (folderUri && folderUri[0]) {
    const selectedPath = folderUri[0].fsPath
    log(`Setting project root to: ${selectedPath}`)
    
    const config = vscode.workspace.getConfiguration('symlink-config')
    await config.update('projectRoot', selectedPath, vscode.ConfigurationTarget.Workspace)
    
    vscode.window.showInformationMessage(`Project root set to: ${selectedPath}`)
  }
}