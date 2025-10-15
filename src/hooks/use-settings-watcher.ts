import * as vscode from 'vscode'

type Handler = (
  section: string,
  parameter: string,
  payload: { value: any; old_value: any },
) => void

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
      if (event.affectsConfiguration(sectionConfig.section)) {
        const newConfig = vscode.workspace.getConfiguration(
          sectionConfig.section,
        )
        const configs = Array.isArray(sectionConfig.handlers)
          ? sectionConfig.handlers
          : [sectionConfig.handlers]

        configs.forEach((configItem) => {
          const parameters = Array.isArray(configItem.parameters)
            ? configItem.parameters
            : [configItem.parameters]

          parameters.forEach((param) => {
            const newValue = newConfig.get(param)
            const oldValue = previousValues[sectionConfig.section][param]

            if (newValue !== oldValue) {
              const payload = { value: newValue, old_value: oldValue }
              const handlers = Array.isArray(configItem.onChange)
                ? configItem.onChange
                : [configItem.onChange]
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
