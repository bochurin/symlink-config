export type ViewMode = 'targets' | 'sources'

export type SymlinkStatus = 'new' | 'deleted' | 'unchanged'

export type ElementType = 'root' | 'dir' | 'file'

export interface SymlinkEntry {
  target: string
  source: string
  type: ElementType
  configPath?: string
}

export interface TreeNode {
  children: Record<string, TreeNode>
  isLeaf: boolean
  other?: string
  type: ElementType
  status: SymlinkStatus
  configPath?: string
}

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
