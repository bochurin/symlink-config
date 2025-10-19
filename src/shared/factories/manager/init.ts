import { info } from '@shared/vscode'
import type { ManagerCallbacks } from './types'

export function createInit<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
  needsRegenerate: (events?: ET, payload?: any) => boolean,
  make: (events?: ET, payload?: any) => Promise<void>,
) {
  return async function init() {
    if (needsRegenerate()) {
      info(`${callbacks.objectName} is inconsistent. Regenerating...`)
      await make()
    }
  }
}