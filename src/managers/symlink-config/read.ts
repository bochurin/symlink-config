import { readFromConfig } from '../../shared/config-ops'

export function read(parameter: string): boolean {
  try {
    const value = readFromConfig<boolean>(`symlink-config.${parameter}`, false)
    return value
  } catch {
    return false
  }
}
