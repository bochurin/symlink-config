export interface SymlinkOperation {
  type: 'create' | 'delete'
  target: string
  source?: string
  isDirectory: boolean
}