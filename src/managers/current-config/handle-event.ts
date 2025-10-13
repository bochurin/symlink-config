import { needsRegenerate } from './needs-regenerate'
import { make } from './make'
import { FileWatchEvent } from '../../hooks/use-file-watcher'

export async function handleEvent(event: string) {
  const needsRegen = event === FileWatchEvent.Deleted || needsRegenerate()

  if (needsRegen) {
    await make()
  }
}
