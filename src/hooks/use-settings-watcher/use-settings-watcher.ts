import * as vscode from 'vscode'
import type { SettingsWatcherConfig } from './types'
import { executeHandlers } from './execute-handlers'

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
      parameters.forEach((parameter) => {
        previousValues[sectionConfig.section][parameter] =
          initialSettings.get(parameter)
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
              executeHandlers(configItem.onChange, {
                section,
                parameter,
                value,
                oldValue,
              })
              previousValues[sectionConfig.section][parameter] = value
            }
          })
        })
      }
    })
  })
}
