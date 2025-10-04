import * as vscode from 'vscode'

export function readFromFile(): Record<string, boolean> {
  try {
    const config = vscode.workspace.getConfiguration()
    return config.get<Record<string, boolean>>('files.exclude', {})
  } catch {
    return {}
  }
}