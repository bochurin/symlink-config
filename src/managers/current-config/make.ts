import { writeFile } from '../../shared/file-ops'
import { FILE_NAMES } from '../../shared/constants'
import { generate } from './generate'
import { log } from '../../shared/state'

export async function make() {
  const content = generate()
  await writeFile(FILE_NAMES.CURRENT_SYMLINK_CONFIG, content)
  log('current.symlink-config.json updated')
}