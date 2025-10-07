let workspaceRoot: string
let nextSymlinkConfig: string
let sylentMode: boolean

export function setWorkspaceRoot(path: string) {
  workspaceRoot = path
}
export function getWorkspaceRoot(): string {
  if (!workspaceRoot) throw new Error('Workspace root not initialized')
  return workspaceRoot
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
