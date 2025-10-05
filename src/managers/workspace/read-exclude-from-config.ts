import { readFromConfig } from '../../shared/config-ops'

export function readExcludeFromConfig() {
  const currentExclusions = readFromConfig<Record<string, boolean>>('files.exclude', {})
  return currentExclusions
}
