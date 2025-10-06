import * as symlinkConfigManager from '../symlink-config'
import { read } from './read'

export async function generate(): Promise<Record<string, { spacing: string; active: boolean }>> {
  const entries: Record<string, { spacing: string; active: boolean }> = {}

  try {
    const gitignoreServiceFiles = symlinkConfigManager.read('gitignoreServiceFiles')
    entries['next.symlink.config.json'] = {
      spacing: '',
      active: gitignoreServiceFiles
    }
  } catch {}

  const currentEntries = await read()
  const builtEntries = { ...currentEntries, ...entries }

  return builtEntries
}
