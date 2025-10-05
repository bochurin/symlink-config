import { writeToConfig } from '../../shared/config-ops'
import { readExcludeFromConfig } from './read-exclude-from-config'
import { buildExclusions } from './build-exclusions'
import { ExclusionMode } from '../../types'

export async function makeExcludeInConfig(mode?: ExclusionMode): Promise<void> {
  const builtExclusions = buildExclusions(mode || ExclusionMode.All)
  const currentExclusions = readExcludeFromConfig()

  const newExclusions = { ...currentExclusions, ...builtExclusions }
  await writeToConfig('files.exclude', newExclusions)
}
