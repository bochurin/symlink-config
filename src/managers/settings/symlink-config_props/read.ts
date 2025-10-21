import { readSettings } from '@/src/shared/settings-ops'
import { SETTINGS } from '@shared/constants'
import {
  SymlinkConfigSettingsProperty,
  SymlinkConfigSettingsPropertyValue,
} from './types'

export function read(params?: {
  property?: SymlinkConfigSettingsProperty
}): SymlinkConfigSettingsPropertyValue {
  const property = params!.property!

  const defaults = SETTINGS.SYMLINK_CONFIG.DEFAULT

  try {
    const configKey = `${SETTINGS.SYMLINK_CONFIG.SECTION}.${property}`
    return readSettings(configKey, defaults[property as keyof typeof defaults])
  } catch {
    return defaults[property as keyof typeof defaults]
  }
}
