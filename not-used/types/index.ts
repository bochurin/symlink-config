export type SymlinkMode = 'full' | 'clean' | 'dry'

export type SymlinkType = 'file' | 'dir'

export interface ProcessResult {
  success: boolean
  message: string
  details?: string[]
}
