import { readConfig } from '@shared/config-ops'

export function read() {
  const currentExclusions = readConfig<Record<string, boolean>>(
    'files.exclude',
    {},
  )
  return currentExclusions
}
