import { writeToConfig } from '../../shared/config-ops'
import { generate } from './generate'
import { read } from './read'

export async function make(
  mode?: 'all' | 'serviceFiles' | 'symlinkConfigs'
): Promise<void> {
  const generatedExclusions = generate(mode || 'all')
  const currentExclusions = read()
  if (JSON.stringify(currentExclusions) != JSON.stringify(generatedExclusions))
    await writeToConfig('files.exclude', generatedExclusions)
}
