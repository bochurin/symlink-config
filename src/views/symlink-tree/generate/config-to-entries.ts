import { Config, SymlinkEntry } from '../types'

export function configToEntries(configText: string): SymlinkEntry[] {
  const entries: SymlinkEntry[] = []

  try {
    const config = JSON.parse(configText) as Config

    if (config.directories) {
      entries.push(
        ...config.directories.map(
          (entry) =>
            ({
              target: entry.target.replace(/^@/, ''),
              source: entry.source.replace(/^@/, ''),
              type: 'dir',
              configPath: entry.configPath?.replace(/^@/, '')
            }) as SymlinkEntry
        )
      )
    }
    if (config.files) {
      entries.push(
        ...config.files.map(
          (entry) =>
            ({
              target: entry.target.replace(/^@/, ''),
              source: entry.source.replace(/^@/, ''),
              type: 'file',
              configPath: entry.configPath?.replace(/^@/, '')
            }) as SymlinkEntry
        )
      )
    }
  } catch (error) {}

  return entries
}
