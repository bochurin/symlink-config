import { writeFile } from '../../shared/file-ops'
import { FILE_NAMES } from '../../shared/constants'
import { generate } from './generate'

export async function make() {
  const content = generate()
  await writeFile(FILE_NAMES.CURRENT_SYMLINK_CONFIG, content)
}