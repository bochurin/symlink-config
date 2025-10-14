let workspaceRoot: string
let workspaceName: string
let nextSymlinkConfig: string
let sylentMode: boolean
let treeProvider: any
const watchers = new Map<string, any>()
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
