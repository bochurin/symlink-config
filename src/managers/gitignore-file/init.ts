import { info } from '../../shared/vscode/info'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'

export async function init() {
  if (needsRegenerate()) {
    info(`next.symlink-config.json is inconsistent. Regenerating...`)
    await make()
  }
}
