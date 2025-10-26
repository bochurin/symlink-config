import { SETTINGS } from '@shared/constants'

import { ExclusionPart } from './enums'

import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'

export type FilesExcludeProperty = typeof SETTINGS.FILES.EXCLUDE

export interface FilesExcludeManager {
  objectName: () => string
  handleEvent: (event: SettingsEvent) => Promise<void>
  read: () => Record<string, boolean>
  make: (mode?: ExclusionPart) => void
  init: () => Promise<void>
}
