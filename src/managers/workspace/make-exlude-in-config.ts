import { writeToConfig, readFromConfig } from '../../shared/config-ops'
import { readExcludeFromConfig } from './read-exclude-from-config'
import { buildExclusions } from './build-exclusions'

export async function makeExludeInConfig(): Promise<void> {
  const currentExclusions = readExcludeFromConfig()
  const builtExclusions = buildExclusions()
  const hideServiceFiles = readFromConfig('symlink-config.hideServiceFiles', false)
  
  if (hideServiceFiles) {
    // Add service file exclusions
    const newExclusions = { ...currentExclusions, ...builtExclusions }
    await writeToConfig('files.exclude', newExclusions)
  } else {
    // Remove service file exclusions
    Object.keys(builtExclusions).forEach(key => {
      delete currentExclusions[key]
    })
    await writeToConfig('files.exclude', currentExclusions)
  }
}
