import { info } from '@shared/vscode'
import { log } from '@shared/log'
import type { Manager, ManagerCallbacks } from './types'

export function createManager<CT>(
  callbacks: ManagerCallbacks<CT>,
): Manager<CT> {
  const read = callbacks.readCallback

  function objectName(params?: { [key: string]: any }): string {
    if (!callbacks.objectNameCallback) {
      return 'object'
    }
    return callbacks.objectNameCallback(params)
  }

  async function write(params?: { content?: CT; [key: string]: any }) {
    const content = params?.content
    if (callbacks.writeCallback && content) {
      callbacks.writeCallback(params)
    }
  }

  function generate(params?: { [key: string]: any }): CT | undefined {
    if (callbacks.generateCallback) {
      return callbacks.generateCallback(params)
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

  async function make(params?: { [key: string]: any }) {
    let content: CT | undefined
    if (read) {
      const initialContent = read()
      const generatedContent = generate({
        initialContent,
        ...params,
      })
      content = callbacks.makeCallback({
        initialContent,
        generatedContent,
        ...params,
      })
      await write({ content, ...params })
    } else {
      const newContent = generate(params)
      content = callbacks.makeCallback({
        newContent,
        ...params,
      })
    }
    if (content) {
      await write({ content, ...params })
      log(`${objectName()} updated`)
    }
  }

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

  if (read) {
    return { objectName, init, handleEvent, make, read }
  } else {
    return { objectName, init, handleEvent, make }
  }
}
