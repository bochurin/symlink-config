import { info } from '../../shared/vscode'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'

export async function handleEvent(event: 'modified' | 'deleted') {
  const needsRegen = event === 'deleted' || needsRegenerate()

  if (needsRegen) {
    info(`next.symlink.config.json was ${event}. Regenerating...`)
    await make()
  }
}
