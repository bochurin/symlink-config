export type SettingsEvent = {
  section: string
  parameter: string
  value: any
  oldValue: any
}

export type Handler = (event: SettingsEvent) => void

export type HandleConfig = {
  parameters: string | string[]
  onChange: Handler | Handler[]
}

export type SectionConfig = {
  section: string
  handlers: HandleConfig | HandleConfig[]
}

export interface SettingsWatcherConfig {
  sections: SectionConfig | SectionConfig[]
}
