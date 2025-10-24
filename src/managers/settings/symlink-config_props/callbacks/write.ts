import { SETTINGS } from '@shared/constants'
import { writeSettings } from '@shared/settings-ops'
import { SymlinkConfigSettingsProperty } from '../types'

export async function writeCallback(params?: {
  content?: Record<string, SymlinkConfigSettingsProperty>
}): Promise<void> {
  if (params?.content) {
    for (const [property, value] of Object.entries(params.content)) {
      await writeSettings(
        `${SETTINGS.SYMLINK_CONFIG.SECTION}.${property}`,
        undefined,
      )
    }
  }
}
