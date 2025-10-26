import { log } from '@log'
import { useSymlinkConfigManager } from '@managers'
import { SETTINGS } from '@shared/constants'
import { info as vscodeInfo } from '@shared/vscode'

export function info(message: string, withLog = true) {
  if (withLog) {log(message)}
  const settingsManager = useSymlinkConfigManager()
  const silent = settingsManager.read(SETTINGS.SYMLINK_CONFIG.SILENT)
  if (!silent) {vscodeInfo(message)}
}