import * as vscode from 'vscode'

import { setWorkspaceRoot } from './shared/state'

import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as workspaceManager from './managers/workspace'

import { setWatchers } from './set-watchers'
import * as path from 'path'
import * as fs from 'fs/promises'

async function findProjectRoot(): Promise<string | null> {
  // Try workspace folders first
  if (vscode.workspace.workspaceFolders) {
    for (const folder of vscode.workspace.workspaceFolders) {
      const rootPath = folder.uri.fsPath
      // Check if this folder contains symlink config indicators
      if (await hasSymlinkConfig(rootPath)) {
        return rootPath
      }
    }
    // If no symlink config found, use first workspace folder
    return vscode.workspace.workspaceFolders[0].uri.fsPath
  }

  // Fallback: try to find root from active editor
  const activeEditor = vscode.window.activeTextEditor
  if (activeEditor) {
    const filePath = activeEditor.document.uri.fsPath
    return await findRootFromFile(filePath)
  }

  return null
}

async function hasSymlinkConfig(dirPath: string): Promise<boolean> {
  try {
    const configPath = path.join(dirPath, 'symlink.config.json')
    await fs.access(configPath)
    return true
  } catch {
    return false
  }
}

async function findRootFromFile(filePath: string): Promise<string | null> {
  let currentDir = path.dirname(filePath)

  while (currentDir !== path.dirname(currentDir)) {
    // Check for project indicators
    const indicators = ['package.json', '.git', 'symlink.config.json']
    for (const indicator of indicators) {
      try {
        await fs.access(path.join(currentDir, indicator))
        return currentDir
      } catch {
        // Continue searching
      }
    }
    currentDir = path.dirname(currentDir)
  }

  return null
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('🔗 Symlink Config extension is now active!')

  const workspaceRoot = await findProjectRoot()
  if (!workspaceRoot) {
    console.log('No project root found')
    return
  }

  setWorkspaceRoot(workspaceRoot)

  await Promise.all([gitignoreManager.init(), workspaceManager.init(), nextConfigManager.init()])

  const dispose = setWatchers()
  context.subscriptions.push({ dispose })
}

export function deactivate() {}
