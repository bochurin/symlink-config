import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs/promises'
import { getWorkspaceRoot } from '../state'
import { info } from '../shared/vscode/info'

let selectedSource: vscode.Uri | undefined
let statusBarItem: vscode.StatusBarItem | undefined

function updateContext() {
  vscode.commands.executeCommand(
    'setContext',
    'symlink-config.sourceSelected',
    !!selectedSource,
  )

  if (selectedSource) {
    if (!statusBarItem) {
      statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100,
      )
      statusBarItem.command = 'symlink-config.cancelSymlinkCreation'
    }
    statusBarItem.text = `$(link) Source: ${path.basename(selectedSource.fsPath)} (click to cancel)`
    statusBarItem.show()
  } else {
    statusBarItem?.hide()
  }
}

export async function selectSymlinkSource(uri: vscode.Uri) {
  if (!selectedSource) {
    // First click - select source
    selectedSource = uri
    updateContext()
    info(
      `Source selected: ${path.basename(uri.fsPath)}. Now right-click target folder and select "Select symlink target folder".`,
    )
    return
  }

  // Second click - create symlink config
  const targetFolder = uri
  const source = selectedSource
  selectedSource = undefined // Reset

  try {
    await createSymlinkConfig(source, targetFolder)
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create symlink config: ${error}`)
  }
}

export function selectSymlinkTarget(uri: vscode.Uri) {
  if (!selectedSource) {
    vscode.window.showWarningMessage(
      'No source selected. First use "Create Symlink" on a file or folder.',
    )
    return
  }

  // Use the same logic as second click in createSymlink
  const targetFolder = uri
  const source = selectedSource
  selectedSource = undefined // Reset
  updateContext()

  createSymlinkConfig(source, targetFolder).catch((error) => {
    vscode.window.showErrorMessage(`Failed to create symlink config: ${error}`)
  })
}

export function cancelSymlinkCreation() {
  if (selectedSource) {
    selectedSource = undefined
    updateContext()
    info('Symlink creation cancelled.')
  } else {
    info('No symlink creation in progress.')
  }
}

async function createSymlinkConfig(
  source: vscode.Uri,
  targetFolder: vscode.Uri,
) {
  const workspaceRoot = getWorkspaceRoot()
  const sourcePath = path
    .relative(workspaceRoot, source.fsPath)
    .replace(/\\/g, '/')
  const targetFolderPath = path
    .relative(workspaceRoot, targetFolder.fsPath)
    .replace(/\\/g, '/')
  const sourceName = path.basename(source.fsPath)

  const configPath = path.join(targetFolder.fsPath, 'symlink.config.json')

  // Read existing config or create new
  let config: any = {
    directories: [],
    files: [],
  }

  try {
    const existing = await fs.readFile(configPath, 'utf8')
    config = JSON.parse(existing)
  } catch {
    // File doesn't exist, use default
  }

  // Determine if source is directory or file
  const stats = await fs.stat(source.fsPath)
  const isDirectory = stats.isDirectory()

  const entry = {
    target: sourceName,
    source: `@${sourcePath}`,
  }

  // Add to appropriate array
  if (isDirectory) {
    config.directories = config.directories || []
    config.directories.push(entry)
  } else {
    config.files = config.files || []
    config.files.push(entry)
  }

  // Write config to file then open it
  const configContent = JSON.stringify(config, null, 2)
  await fs.writeFile(configPath, configContent, 'utf8')
  
  const document = await vscode.workspace.openTextDocument(configPath)
  await vscode.window.showTextDocument(document)

  info(`Symlink config created: ${sourceName} → @${sourcePath}`)
}
