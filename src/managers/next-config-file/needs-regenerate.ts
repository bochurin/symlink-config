import { FileEventType } from '../../hooks/use-file-watcher'
import { log } from '../../shared/state'
import { generate } from './generate'
import { read } from './read'

export function needsRegenerate(event?: FileEventType): boolean {
  const generated = generate()
  const current = read()
  const result = current !== generated

  log(`next-config needsRegenerate: event=${event || 'none'}, result=${result}`)
  return result
}
