import { getWorkspaceRoot } from '@state'
import { log, LogLevel } from '@log'

import { basename, relative, join } from '@shared/file-ops'
import { isSymlink, readFile, writeFile, statFile } from '@shared/file-ops'
import { warning, showError, executeCommand, StatusBarAlignment, openTextDocument, showTextDocument, createStatusBarItem, Uri } from '@shared/vscode'

let selectedSource: Uri | undefined
let statusBarItem: any | undefined

function updateContext() {
  executeCommand(
    'setContext',
    'symlink-config.sourceSelected',
    !!selectedSource,
  )

  if (selectedSource) {
    if (!statusBarItem) {
      statusBarItem = createStatusBarItem(
        StatusBarAlignment.Left,
        100,
      )
      statusBarItem.command = 'symlink-config.cancelSymlinkCreation'
    }
    statusBarItem.text = `$(link) Source: ${basename(selectedSource.fsPath)} (click to cancel)`
    statusBarItem.show()
  } else {
    statusBarItem?.hide()
  }
}

export async function selectSymlinkSource(uri: Uri) {
  // Check if selected item is a symlink
  if (await isSymlink(uri)) {
    warning('Cannot select a symlink as source.')
    return
  }

  if (!selectedSource) {
    // First click - select source
    selectedSource = uri
    updateContext()
    log(
      `Source selected: ${basename(uri.fsPath)}. Now right-click target folder and select "Select symlink target folder".`,
      LogLevel.Info,
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
    showError(`Failed to create symlink config: ${error}`)
  }
}

export async function selectSymlinkTarget(uri: Uri) {
  // Check if selected item is a symlink
  if (await isSymlink(uri)) {
    warning(
      'Cannot select a symlink as target folder.',
    )
    return
  }

  if (!selectedSource) {
    warning(
      'No source selected. First use "Select as symlink source" on a file or folder.',
    )
    return
  }

  // Use the same logic as second click in createSymlink
  const targetFolder = uri
  const source = selectedSource
  selectedSource = undefined // Reset
  updateContext()

  createSymlinkConfig(source, targetFolder).catch((error) => {
    showError(`Failed to create symlink config: ${error}`)
  })
}

export function cancelSymlinkCreation() {
  if (selectedSource) {
    selectedSource = undefined
    updateContext()
    log('Symlink creation cancelled.', LogLevel.Info)
  } else {
    log('No symlink creation in progress.', LogLevel.Info)
  }
}

async function createSymlinkConfig(
  source: Uri,
  targetFolder: Uri,
) {
  const workspaceRoot = getWorkspaceRoot()
  const sourcePath = relative(workspaceRoot, source.fsPath)
    .replace(/\\/g, '/')
  const targetFolderPath = relative(workspaceRoot, targetFolder.fsPath)
    .replace(/\\/g, '/')
  const sourceName = basename(source.fsPath)

  const configPath = join(targetFolder.fsPath, 'symlink-config.json')

  // Read existing config or create new
  let config: any = {
    directories: [],
    files: [],
  }

  try {
    const existing = readFile(workspaceRoot, relative(workspaceRoot, configPath))
    config = JSON.parse(existing)
  } catch {
    // File doesn't exist, use default
  }

  // Determine if source is directory or file
  const stats = statFile(workspaceRoot, relative(workspaceRoot, source.fsPath))
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
  await writeFile(workspaceRoot, relative(workspaceRoot, configPath), configContent)

  const document = await openTextDocument(configPath)
  await showTextDocument(document)

  log(`Symlink config created: ${sourceName} → @${sourcePath}`, LogLevel.Info)
}
