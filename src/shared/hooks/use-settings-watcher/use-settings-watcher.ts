import * as vscode from 'vscode'
import type { SettingsWatcherConfig } from './types'
import { executeHandlers } from './execute-handlers'

export type SettingsWatcher = vscode.Disposable

export function useSettingsWatcher(
  watcherConfig: SettingsWatcherConfig,
): SettingsWatcher {
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
      if (configItem.properties) {
        const params = Array.isArray(configItem.properties)
          ? configItem.properties
          : [configItem.properties]
        params.forEach((property) => {
          previousValues[sectionConfig.section][property] =
            initialSettings.get(property)
        })
      } else {
        // Watch all properties in the section
        const allKeys = Object.keys(initialSettings)
        allKeys.forEach((property) => {
          previousValues[sectionConfig.section][property] =
            initialSettings.get(property)
        })
      }
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
          const properties = configItem.properties
            ? Array.isArray(configItem.properties)
              ? configItem.properties
              : [configItem.properties]
            : Object.keys(previousValues[sectionConfig.section])

          properties.forEach((property) => {
            const value = newConfig.get(property)
            const oldValue = previousValues[sectionConfig.section][property]

            if (value !== oldValue) {
              executeHandlers(configItem.onChange, {
                section,
                parameter: property,
                value,
                oldValue,
              })
              previousValues[sectionConfig.section][property] = value
            }
          })
        })
      }
    })
  })
}
