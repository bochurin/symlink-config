import { generate } from './generate'
import { log } from '@shared/log'
import { write } from './write'

export async function make() {
  const content = generate()

  await write(content)
  log('current.symlink-config.json updated')
}
