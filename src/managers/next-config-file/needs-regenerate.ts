import { FileEvent, FileEventType } from '../../shared/hooks/use-file-watcher'
import { log } from '../../shared/state'
import { generate } from './generate'
import { read } from './read'

export function needsRegenerate(events?: FileEvent | FileEvent[]): boolean {
  const eventType = Array.isArray(events) ? events[0].event : events?.event

  const generated = generate()
  const current = read()
  const result = current !== generated

  log(
    `next.symlink-config.json needsRegenerate: event=${eventType || 'none'}, result=${result}`,
  )
  return result
}
