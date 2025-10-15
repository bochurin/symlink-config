import { needsRegenerate } from './needs-regenerate'
import { make } from './make'
import { FileEventType } from '../../hooks/use-file-watcher'
import { info } from '../../shared/vscode'

export async function handleEvent(event: string) {
  const needsRegen = event === FileEventType.Deleted || needsRegenerate()

  if (needsRegen) {
    info(`current.symlink-config.json was ${event}. Regenerating...`)
    await make()
  }
}
