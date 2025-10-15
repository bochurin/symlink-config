import { writeConfig } from '../../shared/config-ops'
import { generate } from './generate'
import { read } from './read'
import { ExclusionPart } from './types'

export async function make(mode?: ExclusionPart): Promise<void> {
  const { log } = await import('../../shared/state')
  const generatedExclusions = generate(mode || ExclusionPart.All)
  const currentExclusions = await read()
  const mergedExclusions = { ...currentExclusions, ...generatedExclusions }
  if (JSON.stringify(currentExclusions) != JSON.stringify(mergedExclusions)) {
    await writeConfig('files.exclude', mergedExclusions)
    log('files.exclude settings updated')
  }
}
