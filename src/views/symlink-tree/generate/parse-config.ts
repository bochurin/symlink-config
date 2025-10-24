import * as path from 'path'

import { Config, SymlinkConfigEntry } from '../types'

export function parseConfig(configText: string): SymlinkConfigEntry[] {
  const entries: SymlinkConfigEntry[] = []

  try {
    const config = JSON.parse(configText) as Config

    if (config.directories) {
      entries.push(
        ...config.directories.map(
          (entry) =>
            ({
              type: 'dir',
              target: normalizePath(entry.target),
              source: normalizePath(entry.source),
              configPath: entry.configPath ? normalizePath(entry.configPath) : '',
            }) as SymlinkConfigEntry,
        ),
      )
    }
    if (config.files) {
      entries.push(
        ...config.files.map(
          (entry) =>
            ({
              type: 'file',
              target: normalizePath(entry.target),
              source: normalizePath(entry.source),
              configPath: entry.configPath ? normalizePath(entry.configPath) : '',
            }) as SymlinkConfigEntry,
        ),
      )
    }
  } catch (error) {}

  return entries
}

function normalizePath(inputPath: string): string {
  const cleanPath = inputPath.replace(/^@/, '')
  return path.posix.normalize(cleanPath)
}
