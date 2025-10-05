export interface SymlinkConfig {
  directories?: SymlinkEntry[]
  files?: SymlinkEntry[]
  exclude_paths?: string[]
}

export interface SymlinkEntry {
  target: string
  source: string
}

export type SymlinkMode = 'full' | 'clean' | 'dry'

export type SymlinkType = 'file' | 'dir'

export interface ProcessResult {
  success: boolean
  message: string
  details?: string[]
}
