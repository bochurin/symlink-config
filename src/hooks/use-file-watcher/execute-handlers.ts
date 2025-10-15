import * as vscode from 'vscode'
import type { FileEvent, FileEventType, Handler, Filter } from './types'

export function createExecuteHandlers(
  filters: Filter | Filter[] | undefined,
  debounce: number | undefined,
) {
  let debounceTimeout: NodeJS.Timeout | undefined
  let accumulatedEvents: FileEvent[] = []

  return async function executeHandlers(
    handlers: Handler[],
    uri: vscode.Uri,
    eventType: FileEventType,
  ) {
    if (filters) {
      const filterArray = Array.isArray(filters) ? filters : [filters]
      for (const filter of filterArray) {
        const passed = await filter({ uri, event: eventType })
        if (!passed) return
      }
    }

    if (debounce) {
      accumulatedEvents.push({ uri, event: eventType })
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      debounceTimeout = setTimeout(() => {
        const events = [...accumulatedEvents]
        accumulatedEvents = []
        handlers.forEach((handler) => handler(events))
      }, debounce)
    } else {
      handlers.forEach((handler) => handler([{ uri, event: eventType }]))
    }
  }
}
