import { makeWatchers, getWorkspaceName } from '@extension'
import { setWorkspaceName } from '@state'

import { SymlinkConfigSettingsProperty } from '../types'

export async function afterpartyCallback(params?: {
  content?: Record<string, SymlinkConfigSettingsProperty>
}): Promise<void> {
  const workspaceName = getWorkspaceName()
  setWorkspaceName(workspaceName)

  makeWatchers()
}
