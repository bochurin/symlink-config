import { writeToConfig } from '../../shared/config-ops'
import { read } from './read'
import { build } from './build'
import { Mode } from './types'

export async function make(mode?: Mode): Promise<void> {
  const builtExclusions = build(mode || Mode.All)
  await writeToConfig('files.exclude', builtExclusions)
}
