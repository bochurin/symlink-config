import { SettingsEvent } from '@/src/shared/hooks/use-settings-watcher'
import { SETTINGS } from '@shared/constants'

export type FilesSettingsProperty = typeof SETTINGS.FILES.EXCLUDE

export interface FilesSettingsManager {
  objectName: () => string
  handleEvent: (event: SettingsEvent) => Promise<void>
  read: (params?: {
    pattern?: string
    [key: string]: any
  }) => boolean | Record<string, boolean>
}
