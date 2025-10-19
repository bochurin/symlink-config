import type { Manager, ManagerCallbacks } from './types'
import { createRead } from './read'
import { createWrite } from './write'
import { createGenerate } from './generate'
import { createNeedsRegenerate } from './needs-regenerate'
import { createMake } from './make'
import { createHandleEvent } from './handle-event'
import { createInit } from './init'

export function createManager<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
): Manager<CT, ET> {
  const objectName = callbacks.objectName
  const read = createRead(callbacks)
  const write = createWrite(callbacks)
  const generate = createGenerate(callbacks, read)
  const needsRegenerate = createNeedsRegenerate(callbacks, read)
  const make = createMake(callbacks, read, generate, write)
  const handleEvent = createHandleEvent(callbacks, needsRegenerate, make)
  const init = createInit(callbacks, needsRegenerate, make)

  return { objectName, init, handleEvent, read }
}
