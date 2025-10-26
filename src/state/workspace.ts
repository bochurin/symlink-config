let workspaceRoot: string
export function setWorkspaceRoot(path: string) {
  workspaceRoot = path
}
export function getWorkspaceRoot(): string {
  if (!workspaceRoot) {throw new Error('Workspace root not initialized')}
  return workspaceRoot
}

let workspaceName: string
export function setWorkspaceName(path: string) {
  workspaceName = path
}
export function getWorkspaceName(): string {
  if (!workspaceName) {throw new Error('Workspace name not initialized')}
  return workspaceName
}
