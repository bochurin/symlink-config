export interface Config {
  directories?: ConfigEntry[]
  files?: ConfigEntry[]
  exclude_paths?: string[]
}

export interface ConfigEntry {
  target: string
  source: string
  configPath?: string
}
