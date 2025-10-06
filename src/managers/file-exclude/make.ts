import { writeToConfig } from '../../shared/config-ops'
import { read } from './read'
import { generate } from './generate'
import { Mode } from './types'

export async function make(mode?: Mode): Promise<void> {
  const builtExclusions = generate(mode || Mode.All)
  await writeToConfig('files.exclude', builtExclusions)
}
