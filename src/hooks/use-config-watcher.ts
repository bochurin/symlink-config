import * as vscode from 'vscode'

type Handler = (section: string, parameter: string, payload: { value: any; old_value: any }) => void

type ConfigItem = {
  parameters: string | string[]
  onChange: Handler | Handler[]
}

type SectionConfig = {
  section: string
  configs: ConfigItem | ConfigItem[]
}

export interface ConfigWatcherConfig {
  sections: SectionConfig | SectionConfig[]
}

export function useConfigWatcher(config: ConfigWatcherConfig): vscode.Disposable {
  const previousValues: Record<string, Record<string, any>> = {}
  const sections = Array.isArray(config.sections) ? config.sections : [config.sections]

  // Store initial values for all sections
  sections.forEach((sectionConfig) => {
    const initialConfig = vscode.workspace.getConfiguration(sectionConfig.section)
    previousValues[sectionConfig.section] = {}
    const configs = Array.isArray(sectionConfig.configs)
      ? sectionConfig.configs
      : [sectionConfig.configs]

    configs.forEach((configItem) => {
      const parameters = Array.isArray(configItem.parameters)
        ? configItem.parameters
        : [configItem.parameters]
      parameters.forEach((param) => {
        previousValues[sectionConfig.section][param] = initialConfig.get(param)
      })
    })
  })

  return vscode.workspace.onDidChangeConfiguration((event) => {
    sections.forEach((sectionConfig) => {
      if (event.affectsConfiguration(sectionConfig.section)) {
        const newConfig = vscode.workspace.getConfiguration(sectionConfig.section)
        const configs = Array.isArray(sectionConfig.configs)
          ? sectionConfig.configs
          : [sectionConfig.configs]

        configs.forEach((configItem) => {
          const parameters = Array.isArray(configItem.parameters)
            ? configItem.parameters
            : [configItem.parameters]
          
          parameters.forEach((param) => {
            const newValue = newConfig.get(param)
            const oldValue = previousValues[sectionConfig.section][param]

            if (newValue !== oldValue) {
              const payload = { value: newValue, old_value: oldValue }
              const handlers = Array.isArray(configItem.onChange) ? configItem.onChange : [configItem.onChange]
              handlers.forEach((handler) => {
                handler(sectionConfig.section, param, payload)
              })
              previousValues[sectionConfig.section][param] = newValue
            }
          })
        })
      }
    })
  })
}
