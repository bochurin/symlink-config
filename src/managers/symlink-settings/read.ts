import { readConfig } from '../../shared/config-ops'
import { CONFIG_SECTIONS } from '../../shared/constants'

export function read(parameter: string): boolean {
  try {
    const value = readConfig<boolean>(`${CONFIG_SECTIONS.SYMLINK_CONFIG}.${parameter}`, false)
    return value
  } catch {
    return false
  }
}
