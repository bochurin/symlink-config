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

    if (currentConfig) {
      const entries = [
        ...(currentConfig.directories || []),
        ...(currentConfig.files || []),
      ]
      for (const entry of entries) {
        operations.push({
          type: entry.status === 'deleted' ? 'delete' : 'create',
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
