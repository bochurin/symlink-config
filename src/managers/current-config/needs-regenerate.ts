import { FileEvent } from '../../shared/hooks/use-file-watcher'
import { log } from '../../shared/log'
import { generate } from './generate'
import { read } from './read'

export function needsRegenerate(events?: FileEvent | FileEvent[]): boolean {
  const eventType = Array.isArray(events)
    ? events[0].eventType
    : events?.eventType

  const generated = generate()
  const current = read()
  const result = current !== generated

  log(
    `current.symlink-config.json needsRegenerate: event=${eventType || 'none'}, result=${result}`,
  )
  return result
}
