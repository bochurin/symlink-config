import { writeFile } from '../../shared/file-ops'
import { generate } from './generate'

export async function make() {
  const { log } = await import('../../shared/state')
  const content = generate()
  await writeFile('next.symlink-config.json', content)
  log('next.symlink-config.json updated')
}
