import * as vscode from 'vscode'

let workspaceRoot: string
let workspaceName: string
let nextSymlinkConfig: string
let sylentMode: boolean
let treeProvider: any
let outputChannel: vscode.OutputChannel
const watchers = new Map<string, any>()
let processingQueue = Promise.resolve()
let logCount = 0

export function setWorkspaceRoot(path: string) {
  workspaceRoot = path
}
export function getWorkspaceRoot(): string {
  if (!workspaceRoot) throw new Error('Workspace root not initialized')
  return workspaceRoot
}

export function setWorkspaceName(path: string) {
  workspaceName = path
}
export function getWorkspaceName(): string {
  if (!workspaceName) throw new Error('Workspace name not initialized')
  return workspaceName
}

export function setNextConfig(config: string) {
  nextSymlinkConfig = config
}
export function getNextConfig(): string {
  return nextSymlinkConfig
}

export function setSilentMode(mode: boolean) {
  sylentMode = mode
}
export function getSilentMode(): boolean {
  return sylentMode
}

export function setTreeProvider(provider: any) {
  treeProvider = provider
}
export function getTreeProvider(): any {
  return treeProvider
}

export function setOutputChannel(channel: vscode.OutputChannel) {
  outputChannel = channel
}

export function showLogs() {
  if (outputChannel) {
    outputChannel.show()
  }
}

export function log(message: string) {
  if (!outputChannel) {
    console.log('[symlink-config]', message)
    return
  }
  const maxEntries = vscode.workspace.getConfiguration('symlink-config').get<number>('maxLogEntries', 1000)
  if (maxEntries > 0 && logCount >= maxEntries) {
    outputChannel.clear()
    logCount = 0
    const timestamp = new Date().toLocaleTimeString()
    outputChannel.appendLine(`[${timestamp}] Logs cleared (max ${maxEntries} entries reached)`)
    logCount++
  }
  const timestamp = new Date().toLocaleTimeString()
  outputChannel.appendLine(`[${timestamp}] ${message}`)
  logCount++
}

export function clearLogs() {
  if (!outputChannel) return
  outputChannel.clear()
  logCount = 0
  log('Logs cleared manually')
  outputChannel.show()
}

export function registerWatcher(name: string, watcher: any) {
  watchers.get(name)?.dispose()
  watchers.set(name, watcher)
}

export function disposeWatchers(...names: string[]) {
  if (names.length === 0) {
    watchers.forEach((watcher) => watcher.dispose())
    watchers.clear()
  } else {
    names.forEach((name) => {
      watchers.get(name)?.dispose()
      watchers.delete(name)
    })
  }
}

export function queue(fn: () => Promise<void>): Promise<void> {
  processingQueue = processingQueue.then(fn)
  return processingQueue
}
