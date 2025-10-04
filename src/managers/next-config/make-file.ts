import { writeFile } from '../../shared/file-ops'
import { buildNextConfig } from './build-next-config'

export async function makeFile() {
  const content = buildNextConfig()
  await writeFile('next.symlink.config.json', content)
}
