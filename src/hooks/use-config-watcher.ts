import * as vscode from 'vscode'

type Handler = (section: string, parameter: string, payload: { value: any; old_value: any }) => void

type ParameterConfig = {
  parameter: string
  onChange: Handler | Handler[]
}

type SectionConfig = {
  section: string
  parameters: ParameterConfig | ParameterConfig[]
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
    const parameters = Array.isArray(sectionConfig.parameters)
      ? sectionConfig.parameters
      : [sectionConfig.parameters]

    parameters.forEach((param) => {
      previousValues[sectionConfig.section][param.parameter] = initialConfig.get(param.parameter)
    })
  })

  return vscode.workspace.onDidChangeConfiguration((event) => {
    sections.forEach((sectionConfig) => {
      if (event.affectsConfiguration(sectionConfig.section)) {
        const newConfig = vscode.workspace.getConfiguration(sectionConfig.section)
        const parameters = Array.isArray(sectionConfig.parameters)
          ? sectionConfig.parameters
          : [sectionConfig.parameters]

        parameters.forEach((param) => {
          const newValue = newConfig.get(param.parameter)
          const oldValue = previousValues[sectionConfig.section][param.parameter]

          if (newValue !== oldValue) {
            const payload = { value: newValue, old_value: oldValue }
            const handlers = Array.isArray(param.onChange) ? param.onChange : [param.onChange]
            handlers.forEach((handler) => {
              handler(sectionConfig.section, param.parameter, payload)
            })
            previousValues[sectionConfig.section][param.parameter] = newValue
          }
        })
      }
    })
  })
}
