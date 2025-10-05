import { readFromConfig } from '../../shared/config-ops'

export function read() {
  const currentExclusions = readFromConfig<Record<string, boolean>>('files.exclude', {})
  return currentExclusions
}
