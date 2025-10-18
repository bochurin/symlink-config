import { FileEvent } from '@shared/hooks/use-file-watcher'
import { info } from '@shared/vscode'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'
import { basename } from '@shared/file-ops'

export async function handleEvent(events: FileEvent | FileEvent[]) {
  const event = Array.isArray(events) ? events[0] : events

  if (needsRegenerate(events)) {
    info(`${basename(event.uri)} was ${event.eventType}. Regenerating...`)
    await make()
  }
}
