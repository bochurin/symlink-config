import type { ManagerCallbacks } from './types'

export function createWrite<CT, ET>(callbacks: ManagerCallbacks<CT, ET>) {
  return async function write(content?: CT) {
    if (callbacks.writeCallback) {
      callbacks.writeCallback(content)
    }
  }
}