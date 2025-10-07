import * as vscode from 'vscode'
import * as path from 'path'
import { getWorkspaceRoot } from '../state'

export async function openSymlinkConfig(treeItem: any) {
  const workspaceRoot = getWorkspaceRoot()
  
  // Use targetPath from tree item, fallback to root
  const targetFolder = treeItem?.targetPath || ''
  const configPath = path.join(workspaceRoot, targetFolder, 'symlink.config.json')
  
  try {
    const document = await vscode.workspace.openTextDocument(configPath)
    await vscode.window.showTextDocument(document)
  } catch (error) {
    vscode.window.showErrorMessage(`Could not open symlink.config.json: ${error}`)
  }
}