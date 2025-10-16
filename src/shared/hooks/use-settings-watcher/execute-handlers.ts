import type { Handler, SettingsEvent } from './types'

export function executeHandlers(
  handlers: Handler | Handler[],
  event: SettingsEvent,
): void {
  const handlerArray = Array.isArray(handlers) ? handlers : [handlers]
  handlerArray.forEach((handler) => handler(event))
}
