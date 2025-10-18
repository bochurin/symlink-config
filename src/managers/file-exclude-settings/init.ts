import { info } from '@shared/vscode'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'

export async function init() {
  if (needsRegenerate()) {
    info(`files.exclude is inconsistent. Regenerating...`)
    await make()
  }
}
