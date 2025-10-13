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
  debounce?: number // milliseconds, if undefined no debouncing
  filter?: Filter | Filter[] // function(s) to filter events, all must return true
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

  // Filter and debouncing logic
  let debounceTimeout: NodeJS.Timeout | undefined
  let accumulatedEvents: FileEventData[] = []
  
  const executeHandlers = async (
    handlers: Handler[],
    uri: vscode.Uri,
    event: FileWatchEvent,
  ) => {
    // Apply filters if defined
    if (config.filter) {
      const filters = Array.isArray(config.filter)
        ? config.filter
        : [config.filter]
      for (const filter of filters) {
        const passed = await filter(uri, event)
        if (!passed) return // Skip if any filter returns false
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
