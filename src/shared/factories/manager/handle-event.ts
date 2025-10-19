import { info } from '@shared/vscode'
import type { ManagerCallbacks } from './types'

export function createHandleEvent<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
  needsRegenerate: (events?: ET, payload?: any) => boolean,
  make: (events?: ET, payload?: any) => Promise<void>,
) {
  return async function handleEvent(events?: ET, payload?: any) {
    const needsRegen = needsRegenerate(events, payload)
    if (needsRegen) {
      info(`${callbacks.objectName} was affected. Regenerating...`)
      await make(events)
    }
  }
}