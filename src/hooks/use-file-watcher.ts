import * as vscode from 'vscode'

export interface WatcherConfig {
  pattern: string
  onCreate?: ((uri: vscode.Uri) => void) | ((uri: vscode.Uri) => void)[]
  onChange?: ((uri: vscode.Uri) => void) | ((uri: vscode.Uri) => void)[]
  onDelete?: ((uri: vscode.Uri) => void) | ((uri: vscode.Uri) => void)[]
}

export function useFileWatcher(
  config: WatcherConfig
): vscode.FileSystemWatcher {
  const watcher = vscode.workspace.createFileSystemWatcher(
    config.pattern,
    !config.onCreate,
    !config.onChange,
    !config.onDelete
  )

  if (config.onCreate) {
    const handlers = Array.isArray(config.onCreate) ? config.onCreate : [config.onCreate]
    watcher.onDidCreate((uri) => handlers.forEach((handler) => handler(uri)))
  }

  if (config.onChange) {
    const handlers = Array.isArray(config.onChange) ? config.onChange : [config.onChange]
    watcher.onDidChange((uri) => handlers.forEach((handler) => handler(uri)))
  }

  if (config.onDelete) {
    const handlers = Array.isArray(config.onDelete) ? config.onDelete : [config.onDelete]
    watcher.onDidDelete((uri) => handlers.forEach((handler) => handler(uri)))
  }

  return watcher
}
