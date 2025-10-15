import * as vscode from 'vscode'

export type SettingsEvent = {
  section: string
  parameter: string
  value: any
  oldValue: any
}

type Handler = (event: SettingsEvent) => void

type HandleConfig = {
  parameters: string | string[]
  onChange: Handler | Handler[]
}

type SectionConfig = {
  section: string
  handlers: HandleConfig | HandleConfig[]
}

export interface SettingsWatcherConfig {
  sections: SectionConfig | SectionConfig[]
}

export function useSettingsWatcher(
  watcherConfig: SettingsWatcherConfig,
): vscode.Disposable {
  const previousValues: Record<string, Record<string, any>> = {}
  const sections = Array.isArray(watcherConfig.sections)
    ? watcherConfig.sections
    : [watcherConfig.sections]

  // Store initial values for all sections
  sections.forEach((sectionConfig) => {
    const initialSettings = vscode.workspace.getConfiguration(
      sectionConfig.section,
    )
    previousValues[sectionConfig.section] = {}
    const configs = Array.isArray(sectionConfig.handlers)
      ? sectionConfig.handlers
      : [sectionConfig.handlers]

    configs.forEach((configItem) => {
      const parameters = Array.isArray(configItem.parameters)
        ? configItem.parameters
        : [configItem.parameters]
      parameters.forEach((param) => {
        previousValues[sectionConfig.section][param] =
          initialSettings.get(param)
      })
    })
  })

  return vscode.workspace.onDidChangeConfiguration((event) => {
    sections.forEach((sectionConfig) => {
      const section = sectionConfig.section

      if (event.affectsConfiguration(section)) {
        const newConfig = vscode.workspace.getConfiguration(
          sectionConfig.section,
        )
        const handlers = Array.isArray(sectionConfig.handlers)
          ? sectionConfig.handlers
          : [sectionConfig.handlers]

        handlers.forEach((configItem) => {
          const parameters = Array.isArray(configItem.parameters)
            ? configItem.parameters
            : [configItem.parameters]

          parameters.forEach((parameter) => {
            const value = newConfig.get(parameter)
            const oldValue = previousValues[sectionConfig.section][parameter]

            if (value !== oldValue) {
              const handlers = Array.isArray(configItem.onChange)
                ? configItem.onChange
                : [configItem.onChange]
              handlers.forEach((handler) => {
                handler({ section, parameter, value, oldValue })
              })
              previousValues[sectionConfig.section][parameter] = value
            }
          })
        })
      }
    })
  })
}
