import type { ManagerCallbacks } from './types'

export function createNeedsRegenerate<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
  read: (spec?: any) => CT | undefined,
) {
  return function needsRegenerate(events?: ET, payload?: any): boolean {
    if (callbacks.needsRegenerateCallback) {
      const content = read()
      return callbacks.needsRegenerateCallback(content, events, payload)
    }
    return true
  }
}