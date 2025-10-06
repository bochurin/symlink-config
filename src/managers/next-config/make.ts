import { writeFile } from '../../shared/file-ops'
import { generate } from './generate'

export async function make() {
  const content = generate()
  await writeFile('next.symlink.config.json', content)
}
