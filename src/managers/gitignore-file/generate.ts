import * as symlinkConfigManager from '../symlink-settings'

export async function generate(): Promise<
  Record<string, { spacing: string; active: boolean }>
> {
  const generatedEntries: Record<string, { spacing: string; active: boolean }> =
    {}

  try {
    const gitignoreServiceFiles = symlinkConfigManager.read(
      'gitignoreServiceFiles',
    )
    generatedEntries['next.symlink.config.json'] = {
      spacing: '',
      active: gitignoreServiceFiles,
    }
  } catch {}

  return generatedEntries
}
