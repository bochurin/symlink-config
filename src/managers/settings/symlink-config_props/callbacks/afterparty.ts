import { SymlinkConfigSettingsProperty } from '../types'
import { makeWatchers } from '@extension'

export async function afterpartyCallback(params?: {
  content?: Record<string, SymlinkConfigSettingsProperty>
}): Promise<void> {
  makeWatchers()
}
