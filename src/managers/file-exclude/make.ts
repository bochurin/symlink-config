import { writeConfig } from '../../shared/config-ops'
import { generate } from './generate'
import { read } from './read'

export async function make(
  mode?: 'all' | 'serviceFiles' | 'symlinkConfigs'
): Promise<void> {
  const generatedExclusions = generate(mode || 'all')
  const currentExclusions = await read()
  const mergedExclusions = { ...currentExclusions, ...generatedExclusions }
  if (JSON.stringify(currentExclusions) != JSON.stringify(mergedExclusions))
    await writeConfig('files.exclude', mergedExclusions)
}
