import { info } from '@shared/vscode'
import { log } from '@shared/log'
import type { Manager, ManagerCallbacks } from './types'

export function createManager<CT, ET>(
  objectName: string,
  callbacks: ManagerCallbacks<CT, ET>,
): Manager<CT, ET> {
  // Base functions (no dependencies)
  function read(params?: { [key: string]: any }): CT | undefined {
    if (callbacks.readCallback) {
      return callbacks.readCallback(params)
    }
    return undefined
  }

  async function write(params?: { [key: string]: any }) {
    if (callbacks.writeCallback) {
      callbacks.writeCallback(params)
    }
  }

  // Functions that depend on read()
  function generate(params?: { [key: string]: any }): CT | undefined {
    if (callbacks.generateCallback) {
      const content = read()
      return callbacks.generateCallback({ content, ...params })
    }
    return undefined
  }

  function needsRegenerate(params?: { [key: string]: any }): boolean {
    if (callbacks.needsRegenerateCallback) {
      const content = read()
      return callbacks.needsRegenerateCallback({ content, ...params })
    }
    return true
  }

  // Functions that depend on read(), generate(), write()
  async function make(params?: { [key: string]: any }) {
    const initContent = read()
    const newContent = generate(params)
    const content = await callbacks.makeCallback({
      initContent,
      newContent,
      ...params,
    })
    await write({ content, ...params })
    log(`${objectName} updated`)
  }

  // Functions that depend on needsRegenerate(), make()
  async function handleEvent(params?: { [key: string]: any }) {
    const needsRegen = needsRegenerate(params)
    if (needsRegen) {
      info(`${objectName} was affected. Regenerating...`)
      await make(params)
    }
  }

  async function init() {
    if (needsRegenerate()) {
      info(`${objectName} is inconsistent. Regenerating...`)
      await make()
    }
  }

  return { objectName, init, handleEvent, read }
}
