import { FileEvent, FileEventType } from '../../shared/hooks/use-file-watcher'
import { log } from '../../shared/state'
import { generate } from './generate'
import { read } from './read'

export function needsRegenerate(events?: FileEvent | FileEvent[]): boolean {
  const eventType = Array.isArray(events) ? events[0].event : events?.event

  const result = true //TODO: really check if it is needed to regenerate it

  log(
    `.gitignore needsRegenerate: event=${eventType || 'none'}, result=${result}`,
  )
  return result
}
