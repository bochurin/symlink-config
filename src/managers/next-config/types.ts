export interface SymlinkConfig {
  directories?: SymlinkEntry[]
  files?: SymlinkEntry[]
  exclude_paths?: string[]
}

export interface SymlinkEntry {
  target: string
  source: string
  configPath?: string
}
