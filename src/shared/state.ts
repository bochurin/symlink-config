let workspaceRoot: string
let workspaceName: string
let nextSymlinkConfig: string
let sylentMode: boolean
let treeProvider: any
let watchers: any[] = []
let processingQueue = Promise.resolve()

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

export function registerWatcher(watcher: any) {
  watchers.push(watcher)
}

export function disposeWatchers() {
  watchers.forEach((watcher) => watcher.dispose())
  watchers = []
}

export function queue(fn: () => Promise<void>): Promise<void> {
  processingQueue = processingQueue.then(fn)
  return processingQueue
}
