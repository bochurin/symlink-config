import { info } from '../../shared/vscode'
import * as symlinkConfigManager from '../symlink-config'
import { make } from './make'

export async function handleEvent() {
  const gitignoreServiceFiles = symlinkConfigManager.read(
    'gitignoreServiceFiles',
  )
  if (gitignoreServiceFiles) {
    info('.gitignore was modified. Checking ...')
    await make()
  }
}
