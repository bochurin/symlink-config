import { log } from '../../shared/log'
import { write } from './write'
import { generate } from './generate'

export async function make() {
  const content = generate()

  await write(content)
  log('next.symlink-config.json updated')
}
