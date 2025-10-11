import * as symlinkConfigManager from '../symlink-settings'
import { FILE_NAMES } from '../../shared/constants'

export async function generate(): Promise<
  Record<string, { spacing: string; active: boolean }>
> {
  const generatedEntries: Record<string, { spacing: string; active: boolean }> =
    {}

  try {
    const gitignoreServiceFiles = symlinkConfigManager.read(
      'gitignoreServiceFiles',
    )
    generatedEntries[FILE_NAMES.NEXT_SYMLINK_CONFIG] = {
      spacing: '',
      active: gitignoreServiceFiles,
    }
    generatedEntries[FILE_NAMES.CURRENT_SYMLINK_CONFIG] = {
      spacing: '',
      active: gitignoreServiceFiles,
    }
    generatedEntries[FILE_NAMES.APPLY_SYMLINKS_BAT] = {
      spacing: '',
      active: gitignoreServiceFiles,
    }
    generatedEntries[FILE_NAMES.RUN_ADMIN_BAT] = {
      spacing: '',
      active: gitignoreServiceFiles,
    }
  } catch {}

  return generatedEntries
}
