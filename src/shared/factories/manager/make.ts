import { log } from '@shared/log'
import type { ManagerCallbacks } from './types'

export function createMake<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
  read: (spec?: any) => CT | undefined,
  generate: (events?: ET, payload?: any) => CT | undefined,
  write: (content?: CT) => Promise<void>,
) {
  return async function make(events?: ET, payload?: any) {
    const initContent = read()
    const newContent = generate(events, payload)
    const finalContent = await callbacks.makeCallback(
      initContent,
      newContent,
      events,
      payload,
    )
    await write(finalContent)
    log(`${callbacks.objectName} updated`)
  }
}