import { readConfig } from '@shared/config-ops'
import { SETTINGS } from '@shared/constants'
import { SettingsProperty, SettingsPropertyValue } from './types'

export function read(params?: {
  property?: SettingsProperty
}): SettingsPropertyValue | Record<string, SettingsPropertyValue> {
  const property = params ? params.property : undefined

  const defaults = SETTINGS.SYMLINK_CONFIG.DEFAULT

  if (!property) {
    // Return all properties as record
    const result: Record<string, SettingsPropertyValue> = {}
    const properties = [
      SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION,
      SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES,
      SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS,
      SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES,
      SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS,
      SETTINGS.SYMLINK_CONFIG.SYMLINK_PATH_MODE,
      SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE,
      SETTINGS.SYMLINK_CONFIG.MAX_LOG_ENTRIES,
    ]

    for (const prop of properties) {
      const configKey = `${SETTINGS.SYMLINK_CONFIG.SECTION}.${prop}`
      try {
        result[prop] = readConfig(
          configKey,
          defaults[prop as keyof typeof defaults],
        )
      } catch {
        result[prop] = defaults[prop as keyof typeof defaults]
      }
    }
    return result
  }

  // Return specific property
  try {
    const configKey = `${SETTINGS.SYMLINK_CONFIG.SECTION}.${property}`
    return readConfig(configKey, defaults[property as keyof typeof defaults])
  } catch {
    return defaults[property as keyof typeof defaults]
  }
}
