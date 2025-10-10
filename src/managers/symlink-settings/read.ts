import { readConfig } from '../../shared/config-ops'

export function read(parameter: string): boolean {
  try {
    const value = readConfig<boolean>(`symlink-config.${parameter}`, false)
    return value
  } catch {
    return false
  }
}
