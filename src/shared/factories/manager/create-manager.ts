import { info } from '@shared/vscode'
import { log } from '@shared/log'
import type { Manager, ManagerCallbacks } from './types'

export function createManager<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
): Manager<CT, ET> {
  const readCB = callbacks.readCallback
  const makeCB = callbacks.makeCallback
  const writeCB = callbacks.writeCallback || (() => Promise.resolve())
  const generateCB =
    callbacks.generateCallback || ((initialContent: CT) => initialContent)
  const needsRegenerateCB =
    callbacks.needsRegenerateCallback || ((content: CT, events?: ET) => true)

  async function read() {
    const content = await readCB()
    return content
  }

  async function write(content: CT) {
    await writeCB(content)
  }

  async function generate(initialContent: CT) {
    const newContent = await generateCB(initialContent)
    return newContent
  }

  async function make(events?: ET) {
    const initialContent = await read()
    const newContent = await generate(initialContent)

    const finalContent = await makeCB(initialContent, events, newContent)

    await write(finalContent)

    log(`${name} updated`) // TODO: ???
  }

  async function init() {
    if (await needsRegenerate()) {
      info(`${name} is inconsistent. Regenerating...`) //TODO: ???
      await make()
    }
  }

  async function needsRegenerate(events?: ET) {
    const content = await readCB()
    const result = needsRegenerateCB(content, events)
    return result
  }

  async function handleEvent(events: ET) {
    const needsRegen = await needsRegenerate(events)

    if (needsRegen) {
      info(`${name} was affected. Regenerating...`) //TODO: ???
      await make(events)
    }
  }

  const name = callbacks.name

  return { init, read, make, handleEvent, name }
}
