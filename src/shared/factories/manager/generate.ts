import type { ManagerCallbacks } from './types'

export function createGenerate<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
  read: (spec?: any) => CT | undefined,
) {
  return function generate(events?: ET, payload?: any): CT | undefined {
    if (callbacks.generateCallback) {
      const content = read()
      return callbacks.generateCallback(content, events, payload)
    }
    return undefined
  }
}