import { info } from '../../shared/vscode'
import { read as readSymlinkSettings } from '../symlink-settings'
import { make } from './make'

export async function handleEvent() {
  // const gitignoreServiceFiles = readSymlinkSettings('gitignoreServiceFiles')
  // if (gitignoreServiceFiles) {
  info('.gitignore was modified. Checking ...')
  await make()
  // }
}
