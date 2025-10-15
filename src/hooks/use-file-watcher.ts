import * as vscode from 'vscode'

export enum FileEventType {
  Created = 'Created',
  Modified = 'Modified',
  Deleted = 'Deleted',
}

type FileEvent = { uri: vscode.Uri; event: FileEventType }
type Handler = (events: FileEvent[]) => void
type Filter = (event: FileEvent) => Promise<boolean> | boolean

export interface WatcherConfig {
  pattern: string
  debounce?: number
  filters?: Filter | Filter[]
  events:
    | {
        on: FileEventType | FileEventType[]
        handlers: Handler | Handler[]
      }
    | Array<{
        on: FileEventType | FileEventType[]
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

  const watcher = vscode.workspace.createFileSystemWatcher(
    config.pattern,
    createHandlers.length === 0, // ignoreCreateEvents
    changeHandlers.length === 0, // ignoreChangeEvents
    deleteHandlers.length === 0, // ignoreDeleteEvents
  )

  // Filter and debouncing logic
  let debounceTimeout: NodeJS.Timeout | undefined
  let accumulatedEvents: FileEvent[] = []

  const executeHandlers = async (
    handlers: Handler[],
    uri: vscode.Uri,
    eventType: FileEventType,
  ) => {
    if (config.filters) {
      const filters = Array.isArray(config.filters)
        ? config.filters
        : [config.filters]
      for (const filter of filters) {
        const passed = await filter({ uri, event: eventType })
        if (!passed) return
      }
    }

    if (config.debounce) {
      accumulatedEvents.push({ uri, event: eventType })
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      debounceTimeout = setTimeout(() => {
        const events = [...accumulatedEvents]
        accumulatedEvents = []
        handlers.forEach((handler) => handler(events))
      }, config.debounce)
    } else {
      handlers.forEach((handler) => handler([{ uri, event: eventType }]))
    }
  }

  if (createHandlers.length > 0) {
    watcher.onDidCreate((uri) =>
      executeHandlers(createHandlers, uri, FileEventType.Created),
    )
  }

  if (changeHandlers.length > 0) {
    watcher.onDidChange((uri) =>
      executeHandlers(changeHandlers, uri, FileEventType.Modified),
    )
  }

  if (deleteHandlers.length > 0) {
    watcher.onDidDelete((uri) =>
      executeHandlers(deleteHandlers, uri, FileEventType.Deleted),
    )
  }

  return watcher
}
