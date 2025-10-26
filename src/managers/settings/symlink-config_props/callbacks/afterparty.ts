import { makeWatchers } from '@extension'

import { SymlinkConfigSettingsProperty } from '../types'

export async function afterpartyCallback(params?: {
  content?: Record<string, SymlinkConfigSettingsProperty>
}): Promise<void> {
  makeWatchers()
}
