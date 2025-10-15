import { info } from '../../shared/vscode'
import { log } from '../../shared/state'
import type { Manager, ManagerCallbacks } from './types'

export function createManager<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
): Manager<CT, ET> {
  const readCB = callbacks.readCallback
  const makeCB = callbacks.makeCallbak
  const writeCB = callbacks.writeCallback || (() => Promise.resolve())
  const generateCB =
    callbacks.generateCallback || ((initialContent: CT) => initialContent)
  const needsRegenerateCB =
    callbacks.needsRegenerateCallback || ((content: CT, events?: ET) => true)
  const nameCB = callbacks.nameCallback || (() => 'file') //TODO: ???

  function read() {
    const content = readCB()
    return content
  }

  async function write(content: CT) {
    await writeCB(content)
  }

  function generate(initialContent: CT) {
    const newContent = generateCB(initialContent)
    return newContent
  }

  async function make(events?: ET) {
    const initialContent = read()
    const newContent = generate(initialContent)

    const finalContent = makeCB(initialContent, events, newContent)

    await write(finalContent)

    log(`${nameCB()} updated`) // TODO: ???
  }

  async function init() {
    if (needsRegenerate()) {
      info(`${nameCB()} is inconsistent. Regenerating...`) //TODO: ???
      await make()
    }
  }

  function needsRegenerate(events?: ET) {
    const content = readCB()
    const result = needsRegenerateCB(content, events)
    return result
  }

  async function handleEvent(events: ET) {
    const needsRegen = needsRegenerate(events)

    if (needsRegen) {
      info(`${nameCB()} was affected. Regenerating...`) //TODO: ???
      await make(events)
    }
  }

  return { init, read, make, handleEvent }
}
