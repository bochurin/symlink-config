import { FileEvent, FileEventType } from '../../hooks/use-file-watcher'
import { info } from '../../shared/vscode'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'

export async function handleEvent(events: FileEvent | FileEvent[]) {
  const eventType = Array.isArray(events) ? events[0].event : events.event

  const needsRegen =
    eventType === FileEventType.Deleted || needsRegenerate(events)

  if (needsRegen) {
    info(`.gitignore was ${eventType}. Regenerating...`)
    await make()
  }
}
