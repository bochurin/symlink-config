import * as vscode from 'vscode'

export function readSettings<T>(parameter: string, defaultValue: T): T {
  try {
    const config = vscode.workspace.getConfiguration()
    const result = config.get<T>(parameter, defaultValue)
    // Convert VSCode Configuration Proxy to plain object for Record types
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      return { ...result } as T
    }
    return result
  } catch {
    return defaultValue
  }
}
