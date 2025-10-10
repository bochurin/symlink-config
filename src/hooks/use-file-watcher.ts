import * as vscode from 'vscode'

export enum FileWatchEvent {
  Created = 'Created',
  Modified = 'Modified',
  Deleted = 'Deleted',
}

type Handler = (uri: vscode.Uri, event: FileWatchEvent) => void

export interface WatcherConfig {
  pattern: string
  // Legacy syntax (backward compatibility)
  onCreate?: Handler | Handler[]
  onChange?: Handler | Handler[]
  onDelete?: Handler | Handler[]
  // New flexible syntax
  events?:
    | {
        on: FileWatchEvent | FileWatchEvent[]
        handler: Handler | Handler[]
      }
    | Array<{
        on: FileWatchEvent | FileWatchEvent[]
        handler: Handler | Handler[]
      }>
}

export function useFileWatcher(
  config: WatcherConfig,
): vscode.FileSystemWatcher {
  // Collect handlers for each event type
  const createHandlers: Handler[] = []
  const changeHandlers: Handler[] = []
  const deleteHandlers: Handler[] = []

  // Process legacy syntax
  if (config.onCreate) {
    const handlers = Array.isArray(config.onCreate)
      ? config.onCreate
      : [config.onCreate]
    createHandlers.push(...handlers)
  }
  if (config.onChange) {
    const handlers = Array.isArray(config.onChange)
      ? config.onChange
      : [config.onChange]
    changeHandlers.push(...handlers)
  }
  if (config.onDelete) {
    const handlers = Array.isArray(config.onDelete)
      ? config.onDelete
      : [config.onDelete]
    deleteHandlers.push(...handlers)
  }

  // Process new flexible syntax
  if (config.events) {
    const eventConfigs = Array.isArray(config.events)
      ? config.events
      : [config.events]
    for (const eventConfig of eventConfigs) {
      const events = Array.isArray(eventConfig.on)
        ? eventConfig.on
        : [eventConfig.on]
      const handlers = Array.isArray(eventConfig.handler)
        ? eventConfig.handler
        : [eventConfig.handler]

      for (const event of events) {
        switch (event) {
          case FileWatchEvent.Created:
            createHandlers.push(...handlers)
            break
          case FileWatchEvent.Modified:
            changeHandlers.push(...handlers)
            break
          case FileWatchEvent.Deleted:
            deleteHandlers.push(...handlers)
            break
        }
      }
    }
  }

  const watcher = vscode.workspace.createFileSystemWatcher(
    config.pattern,
    createHandlers.length === 0, // ignoreCreateEvents
    changeHandlers.length === 0, // ignoreChangeEvents
    deleteHandlers.length === 0, // ignoreDeleteEvents
  )

  if (createHandlers.length > 0) {
    watcher.onDidCreate((uri) =>
      createHandlers.forEach((handler) => handler(uri, FileWatchEvent.Created)),
    )
  }

  if (changeHandlers.length > 0) {
    watcher.onDidChange((uri) =>
      changeHandlers.forEach((handler) =>
        handler(uri, FileWatchEvent.Modified),
      ),
    )
  }

  if (deleteHandlers.length > 0) {
    watcher.onDidDelete((uri) =>
      deleteHandlers.forEach((handler) => handler(uri, FileWatchEvent.Deleted)),
    )
  }

  return watcher
}
