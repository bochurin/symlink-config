import type { ManagerCallbacks } from './types'

export function createRead<CT, ET>(callbacks: ManagerCallbacks<CT, ET>) {
  return function read(spec?: any): CT | undefined {
    if (callbacks.readCallback) {
      return callbacks.readCallback(spec)
    }
    return undefined
  }
}