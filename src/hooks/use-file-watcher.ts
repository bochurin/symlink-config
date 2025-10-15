import * as vscode from 'vscode'

export enum FileWatchEvent {
  Created = 'Created',
  Modified = 'Modified',
  Deleted = 'Deleted',
}

type FileEventData = { uri: vscode.Uri; event: FileWatchEvent }
type Handler = (events: FileEventData[]) => void
type Filter = (
  uri: vscode.Uri,
  event: FileWatchEvent,
) => Promise<boolean> | boolean

export interface WatcherConfig {
  pattern: string
  debounce?: number
  filters?: Filter | Filter[]
  events:
    | {
        on: FileWatchEvent | FileWatchEvent[]
        handlers: Handler | Handler[]
      }
    | Array<{
        on: FileWatchEvent | FileWatchEvent[]
        handlers: Handler | Handler[]
      }>
}

export function useFileWatcher(
  config: WatcherConfig,
): vscode.FileSystemWatcher {
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

  const watcher = vscode.workspace.createFileSystemWatcher(
    config.pattern,
    createHandlers.length === 0, // ignoreCreateEvents
    changeHandlers.length === 0, // ignoreChangeEvents
    deleteHandlers.length === 0, // ignoreDeleteEvents
  )

  // Filter and debouncing logic
  let debounceTimeout: NodeJS.Timeout | undefined
  let accumulatedEvents: FileEventData[] = []

  const executeHandlers = async (
    handlers: Handler[],
    uri: vscode.Uri,
    event: FileWatchEvent,
  ) => {
    if (config.filters) {
      const filters = Array.isArray(config.filters)
        ? config.filters
        : [config.filters]
      for (const filter of filters) {
        const passed = await filter(uri, event)
        if (!passed) return
      }
    }

    if (config.debounce) {
      accumulatedEvents.push({ uri, event })
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      debounceTimeout = setTimeout(() => {
        const events = [...accumulatedEvents]
        accumulatedEvents = []
        handlers.forEach((handler) => handler(events))
      }, config.debounce)
    } else {
      handlers.forEach((handler) => handler([{ uri, event }]))
    }
  }

  if (createHandlers.length > 0) {
    watcher.onDidCreate((uri) =>
      executeHandlers(createHandlers, uri, FileWatchEvent.Created),
    )
  }

  if (changeHandlers.length > 0) {
    watcher.onDidChange((uri) =>
      executeHandlers(changeHandlers, uri, FileWatchEvent.Modified),
    )
  }

  if (deleteHandlers.length > 0) {
    watcher.onDidDelete((uri) =>
      executeHandlers(deleteHandlers, uri, FileWatchEvent.Deleted),
    )
  }

  return watcher
}
