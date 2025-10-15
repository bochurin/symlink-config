import { FileEventType } from '../../hooks/use-file-watcher'
import { info } from '../../shared/vscode'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'

export async function handleEvent(event: FileEventType) {
  const needsRegen = event === FileEventType.Deleted || needsRegenerate(event)

  if (needsRegen) {
    info(`next.symlink-config.json was ${event}. Regenerating...`)
    await make()
  }
}
