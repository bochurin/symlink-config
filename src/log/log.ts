import { useSymlinkConfigManager } from '@managers'
import { SETTINGS } from '@shared/constants'
import { getOutputChannel } from '@state'

let logCount = 0

export async function log(message: string) {
  const outputChannel = getOutputChannel()
  if (!outputChannel) {
    console.log('[symlink-config]', message)
    return
  }
  const settingsManager = useSymlinkConfigManager()
  const maxEntries = settingsManager.read(SETTINGS.SYMLINK_CONFIG.MAX_LOG_ENTRIES) as number
  if (maxEntries > 0 && logCount >= maxEntries) {
    outputChannel.clear()
    logCount = 0
    const timestamp = new Date().toLocaleTimeString()
    outputChannel.appendLine(
      `[${timestamp}] Logs cleared (max ${maxEntries} entries reached)`,
    )
    logCount++
  }
  const timestamp = new Date().toLocaleTimeString()
  outputChannel.appendLine(`[${timestamp}] ${message}`)
  logCount++
}

export function clearLogs() {
  const outputChannel = getOutputChannel()
  if (!outputChannel) {return}
  outputChannel.clear()
  logCount = 0
  log('Logs cleared manually')
  outputChannel.show()
}

export function showLogs() {
  const outputChannel = getOutputChannel()
  if (outputChannel) {
    outputChannel.show()
  }
}
