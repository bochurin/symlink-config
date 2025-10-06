import * as symlinkConfigManager from '../symlink-config'

import { info } from '../../shared/vscode'
import { make } from './make'
import { needsRegenerate } from './needs-regenerate'

export async function handleEvent(event: 'modified' | 'deleted') {
  const gitignoreServiceFiles = symlinkConfigManager.read(
    'gitignoreServiceFiles'
  )
  if (!gitignoreServiceFiles) {
    return
  }

  const needsRegen = event === 'deleted' || needsRegenerate()

  if (needsRegen) {
    info('.gitignore is not correct or absent. Generating ...')
    await make()
  }
}
