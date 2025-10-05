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

export const ExclusionMode = {
  All: 'all',
  ServiceFiles: 'serviceFiles',
  SymlinkConfigs: 'symlinkConfigs'
} as const

export type ExclusionMode = (typeof ExclusionMode)[keyof typeof ExclusionMode]
