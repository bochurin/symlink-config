import { useCurrentSymlinkConfigManager } from '@managers/files/current_symlink-config_json'
import { useNextSymlinkConfigManager } from '@managers/files/next_symlink-config_json'
import { useSymlinkConfigManager } from '@managers/settings/symlink-config_props'
import { SETTINGS } from '@shared/constants'
import { SymlinkOperation } from './types'

export function collectOperations(): SymlinkOperation[] {
  const settingsManager = useSymlinkConfigManager()
  const mode = settingsManager.read(
    SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION_MODE,
  ) as 'complete' | 'incremental'
  const operations: SymlinkOperation[] = []

  if (mode === 'complete') {
    const currentManager = useCurrentSymlinkConfigManager()
    const currentContent = currentManager.read()
    const currentConfig = currentContent ? JSON.parse(currentContent) : null

    if (currentConfig) {
      const entries = [
        ...(currentConfig.directories || []),
        ...(currentConfig.files || []),
      ]
      for (const entry of entries) {
        operations.push({
          type: 'delete',
          target: entry.target,
          source: entry.source,
          isDirectory: entry.type === 'dir',
        })
      }
    }

    const nextManager = useNextSymlinkConfigManager()
    const nextContent = nextManager.read()
    const nextConfig = nextContent ? JSON.parse(nextContent) : null

    if (nextConfig) {
      const entries = [
        ...(nextConfig.directories || []),
        ...(nextConfig.files || []),
      ]
      for (const entry of entries) {
        operations.push({
          type: 'create',
          target: entry.target,
          source: entry.source,
          isDirectory: entry.type === 'dir',
        })
      }
    }
  } else {
    const currentManager = useCurrentSymlinkConfigManager()
    const currentContent = currentManager.read()
    const currentConfig = currentContent ? JSON.parse(currentContent) : null

    const nextManager = useNextSymlinkConfigManager()
    const nextContent = nextManager.read()
    const nextConfig = nextContent ? JSON.parse(nextContent) : null

    const currentEntries = currentConfig
      ? [
          ...(currentConfig.directories || []),
          ...(currentConfig.files || []),
        ]
      : []
    const nextEntries = nextConfig
      ? [...(nextConfig.directories || []), ...(nextConfig.files || [])]
      : []

    const nextMap = new Map(
      nextEntries.map((e) => [e.target, e.source]),
    )

    for (const entry of currentEntries) {
      const nextSource = nextMap.get(entry.target)
      if (nextSource === undefined || nextSource !== entry.source) {
        operations.push({
          type: 'delete',
          target: entry.target,
          source: entry.source,
          isDirectory: entry.type === 'dir',
        })
      }
    }

    const currentMap = new Map(
      currentEntries.map((e) => [e.target, e.source]),
    )

    for (const entry of nextEntries) {
      const currentSource = currentMap.get(entry.target)
      if (currentSource === undefined || currentSource !== entry.source) {
        operations.push({
          type: 'create',
          target: entry.target,
          source: entry.source,
          isDirectory: entry.type === 'dir',
        })
      }
    }
  }

  return operations.sort((a, b) => {
    if (a.type === 'delete' && b.type === 'create') return -1
    if (a.type === 'create' && b.type === 'delete') return 1
    return 0
  })
}
