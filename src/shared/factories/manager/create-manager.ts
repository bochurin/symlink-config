import { info } from '@shared/vscode'
import { log } from '@shared/log'
import type { Manager, ManagerCallbacks } from './types'

export function createManager<CT>(
  callbacks: ManagerCallbacks<CT>,
): Manager<CT> {
  const read = callbacks.readCallback

  async function write(params?: { [key: string]: any }) {
    if (callbacks.writeCallback) {
      callbacks.writeCallback(params)
    }
  }

  // Functions that depend on read()
  function generate(params?: { [key: string]: any }): CT | undefined {
    if (callbacks.generateCallback) {
      if (read) {
        const content = read()
        return callbacks.generateCallback({ content, ...params })
      } else {
        return callbacks.generateCallback(params)
      }
    }
    return undefined
  }

  function needsRegenerate(params?: { [key: string]: any }): boolean {
    if (callbacks.needsRegenerateCallback) {
      if (read) {
        const content = read()
        return callbacks.needsRegenerateCallback({ content, ...params })
      } else {
        return callbacks.needsRegenerateCallback(params)
      }
    }
    return true
  }

  // Functions that depend on read(), generate(), write()
  async function make(params?: { [key: string]: any }) {
    let content: CT | undefined
    if (read) {
      const initContent = read()
      const newContent = generate({ initContent, ...params })
      content = await callbacks.makeCallback({
        initContent,
        newContent,
        ...params,
      })
      await write({ content, ...params })
    } else {
      const newContent = generate(params)
      content = await callbacks.makeCallback({
        newContent,
        ...params,
      })
    }
    if (content) {
      await write({ content, ...params })
      log(`${objectName()} updated`)
    }
  }

  // Functions that depend on needsRegenerate(), make()
  async function handleEvent(params?: { [key: string]: any }) {
    const needsRegen = needsRegenerate(params)
    if (needsRegen) {
      info(`${objectName()} was affected. Regenerating...`)
      await make(params)
    }
  }

  async function init() {
    if (needsRegenerate()) {
      info(`${objectName()} is inconsistent. Regenerating...`)
      await make()
    }
  }

  function objectName(params?: { [key: string]: any }): string {
    if (!callbacks.objectNameCallback) {
      return 'object'
    }
    return callbacks.objectNameCallback(params)
  }

  if (read) {
    return { objectName, init, handleEvent, read }
  } else {
    return { objectName, init, handleEvent }
  }
}
