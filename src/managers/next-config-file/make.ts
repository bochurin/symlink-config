import { writeFile } from '../../shared/file-ops'
import { generate } from './generate'
import { log } from '../../shared/state'

export async function make() {
  const content = generate()
  await writeFile('next.symlink-config.json', content)
  log('next.symlink-config.json updated')
}
