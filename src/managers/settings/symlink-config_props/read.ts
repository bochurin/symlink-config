import { readSettings } from '@/src/shared/settings-ops'
import { SETTINGS } from '@shared/constants'
import {
  SymlinkConfigSettingsProperty,
  SymlinkConfigSettingsPropertyValue,
} from './types'

export function read(params?: {
  property?: SymlinkConfigSettingsProperty
}):
  | SymlinkConfigSettingsPropertyValue
  | Record<string, SymlinkConfigSettingsPropertyValue> {
  const property = params?.property

  const defaults = SETTINGS.SYMLINK_CONFIG.DEFAULT

  if (property) {
    try {
      const configKey = `${SETTINGS.SYMLINK_CONFIG.SECTION}.${property}`
      return readSettings(
        configKey,
        defaults[property as keyof typeof defaults],
      )
    } catch {
      return defaults[property as keyof typeof defaults]
    }
  }

  // Return all properties as record when no specific property requested
  const allProperties: Record<string, SymlinkConfigSettingsPropertyValue> = {}
  for (const [key, defaultValue] of Object.entries(defaults)) {
    try {
      const configKey = `${SETTINGS.SYMLINK_CONFIG.SECTION}.${key}`
      allProperties[key] = readSettings(configKey, defaultValue)
    } catch {
      allProperties[key] = defaultValue
    }
  }
  return allProperties
}
