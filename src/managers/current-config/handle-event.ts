import { needsRegenerate } from './needs-regenerate'
import { make } from './make'
import { FileEvent, FileEventType } from '../../shared/hooks/use-file-watcher'
import { info } from '../../shared/vscode'

export async function handleEvent(events: FileEvent | FileEvent[]) {
  const eventType = Array.isArray(events)
    ? events[0].eventType
    : events.eventType
  const needsRegen = eventType === FileEventType.Deleted || needsRegenerate()

  if (needsRegen) {
    info(`current.symlink-config.json was ${eventType}. Regenerating...`)
    await make()
  }
}
