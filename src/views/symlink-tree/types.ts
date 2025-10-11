export interface Config {
  directories?: Array<{
    target: string
    source: string
    configPath: string
  }>
  files?: Array<{
    target: string
    source: string
    configPath: string
  }>
}

export type SymlinkType = 'dir' | 'file'

export type SymlinkStatus = 'new' | 'deleted' | 'unchanged'

export interface SymlinkConfigEntry {
  type: SymlinkType
  target: string
  source: string
  configPath: string
  symlinkStatus?: SymlinkStatus
}

export type TreeNodeType = 'root' | SymlinkType
export type treeBase = 'targets' | 'sources'

export interface TreeNode {
  children: Record<string, TreeNode>
  isSymlinkLeaf: boolean
  type: TreeNodeType
  linkedPath: string
  iconPath?: string
  configPath?: string
  symlinkStatus?: SymlinkStatus
  displayName?: string
}
