import * as vscode from 'vscode'

export function readConfig<T>(parameter: string, defaultValue: T): T {
  try {
    const config = vscode.workspace.getConfiguration()
    return config.get<T>(parameter, defaultValue)
  } catch {
    return defaultValue
  }
}
