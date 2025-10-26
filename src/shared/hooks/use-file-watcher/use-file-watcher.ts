import * as vscode from 'vscode'

import { Handler, WatcherConfig } from './types'
import { FileEventType } from './enums'
import { createExecuteHandlers } from './execute-handlers'
import { createFileSystemWatcher } from '@shared/vscode'

export type FileWatcher = vscode.FileSystemWatcher

export function useFileWatcher(config: WatcherConfig): FileWatcher {
  const createHandlers: Handler[] = []
  const changeHandlers: Handler[] = []
  const deleteHandlers: Handler[] = []

  const eventConfigs = Array.isArray(config.events)
    ? config.events
    : [config.events]

  for (const eventConfig of eventConfigs) {
    const events = Array.isArray(eventConfig.on)
      ? eventConfig.on
      : [eventConfig.on]
    const handlers = Array.isArray(eventConfig.handlers)
      ? eventConfig.handlers
      : [eventConfig.handlers]

    for (const event of events) {
      switch (event) {
        case FileEventType.Created:
          createHandlers.push(...handlers)
          break
        case FileEventType.Modified:
          changeHandlers.push(...handlers)
          break
        case FileEventType.Deleted:
          deleteHandlers.push(...handlers)
          break
      }
    }
  }

  const watcher = createFileSystemWatcher(
    config.pattern,
    createHandlers.length === 0, // ignoreCreateEvents
    changeHandlers.length === 0, // ignoreChangeEvents
    deleteHandlers.length === 0, // ignoreDeleteEvents
  )

  const executeHandlers = createExecuteHandlers(config.filters, config.debounce)

  if (createHandlers.length > 0) {
    watcher.onDidCreate((uri: vscode.Uri) =>
      executeHandlers(createHandlers, uri, FileEventType.Created),
    )
  }

  if (changeHandlers.length > 0) {
    watcher.onDidChange((uri: vscode.Uri) =>
      executeHandlers(changeHandlers, uri, FileEventType.Modified),
    )
  }

  if (deleteHandlers.length > 0) {
    watcher.onDidDelete((uri: vscode.Uri) =>
      executeHandlers(deleteHandlers, uri, FileEventType.Deleted),
    )
  }

  return watcher
}
