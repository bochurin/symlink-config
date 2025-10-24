export interface Config {
  directories?: ConfigEntry[]
  files?: ConfigEntry[]
}

export interface ConfigEntry {
  target: string
  source: string
  configPath?: string
}
