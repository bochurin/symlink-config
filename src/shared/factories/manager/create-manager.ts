import { info } from '@shared/vscode'
import { log } from '@shared/log'
import type { Manager, ManagerCallbacks } from './types'

function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

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
    // Read current content if available
    const initialContent = read ? read() : undefined

    // Generate new content
    const generatedContent = generate({
      initialContent,
      ...params,
    })

    // Determine final content using makeCallback or generated content
    const finalContent = callbacks.makeCallback
      ? callbacks.makeCallback({
          initialContent,
          generatedContent,
          ...params,
        })
      : generatedContent

    // Write final content if it exists and is different from initial
    if (finalContent && !isEqual(finalContent, initialContent)) {
      await write({ content: finalContent, ...params })
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
