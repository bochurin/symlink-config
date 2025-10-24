import { FileWatcher } from '@shared/hooks/use-file-watcher'
import { SettingsWatcher } from '@shared/hooks/use-settings-watcher'

export type Watcher = FileWatcher | SettingsWatcher
