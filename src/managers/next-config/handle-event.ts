import { info } from '../../shared/vscode'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'
import { FileEvent } from './types'

export async function handleEvent(event: FileEvent) {
  const needsRegen = event === FileEvent.Deleted || needsRegenerate()

  if (needsRegen) {
    info(`next.symlink.config.json was ${event}. Regenerating...`)
    await make()
  }
}
