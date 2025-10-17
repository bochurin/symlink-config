import { FileEvent, FileEventType } from '../../shared/hooks/use-file-watcher'
import { info } from '../../shared/vscode'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'

export async function handleEvent(events: FileEvent | FileEvent[]) {
  const eventType = Array.isArray(events)
    ? events[0].eventType
    : events.eventType

  const needsRegen =
    eventType === FileEventType.Deleted || needsRegenerate(events)

  if (needsRegen) {
    info(`next.symlink-config.json was ${eventType}. Regenerating...`)
    await make()
  }
}
