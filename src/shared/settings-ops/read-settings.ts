import { getConfiguration } from '@shared/vscode'

export function readSettings<T>(parameter: string, defaultValue: T): T {
  try {
    const config = getConfiguration()
    const result = config.get(parameter, defaultValue) as T
    // Convert VSCode Configuration Proxy to plain object for Record types
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      return { ...result } as T
    }
    return result
  } catch {
    return defaultValue
  }
}
