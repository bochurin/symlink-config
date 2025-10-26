import { log } from '@log'
import { useSymlinkConfigManager } from '@managers'
import { SETTINGS } from '@shared/constants'
import { showError as vscodeShowError } from '@shared/vscode'

export function showError(message: string, withLog = true): void {
  if (withLog) {log(`ERROR: ${message}`)}
  
  const settingsManager = useSymlinkConfigManager()
  const silent = settingsManager.read(SETTINGS.SYMLINK_CONFIG.SILENT)
  
  if (!silent) {
    vscodeShowError(message)
  }
}