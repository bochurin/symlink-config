import { writeConfig } from '../../shared/config-ops'
import { generate } from './generate'
import { read } from './read'
import { GenerationMode } from './types'

export async function make(mode?: GenerationMode): Promise<void> {
  const generatedExclusions = generate(mode || GenerationMode.All)
  const currentExclusions = await read()
  const mergedExclusions = { ...currentExclusions, ...generatedExclusions }
  if (JSON.stringify(currentExclusions) != JSON.stringify(mergedExclusions))
    await writeConfig('files.exclude', mergedExclusions)
}
