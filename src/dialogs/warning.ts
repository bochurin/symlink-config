import { log } from '@log'
import { useSymlinkConfigManager } from '@managers'
import { SETTINGS } from '@shared/constants'
import { warning as vscodeWarning } from '@shared/vscode'

export function warning(message: string, withLog = true) {
  if (withLog) {log(`WARNING: ${message}`)}
  const settingsManager = useSymlinkConfigManager()
  const silent = settingsManager.read(SETTINGS.SYMLINK_CONFIG.SILENT)
  if (!silent) {vscodeWarning(message)}
}