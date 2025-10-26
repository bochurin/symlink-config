import { log } from '@log'
import { useSymlinkConfigManager } from '@managers'
import { SETTINGS } from '@shared/constants'
import { warningChoice as vscodeWarningChoice } from '@shared/vscode'

export async function warningChoice(message: string, ...options: string[]): Promise<string | undefined>
export async function warningChoice(message: string, withLog: boolean, ...options: string[]): Promise<string | undefined>
export async function warningChoice(message: string, withLogOrFirstOption: boolean | string, ...options: string[]): Promise<string | undefined> {
  let withLog = true
  let actualOptions: string[]
  
  if (typeof withLogOrFirstOption === 'boolean') {
    withLog = withLogOrFirstOption
    actualOptions = options
  } else {
    actualOptions = [withLogOrFirstOption, ...options]
  }
  
  if (withLog) {log(`WARNING CHOICE: ${message} [${actualOptions.join(', ')}]`)}
  
  const settingsManager = useSymlinkConfigManager()
  const silent = settingsManager.read(SETTINGS.SYMLINK_CONFIG.SILENT)
  
  if (silent) {
    if (withLog) {log(`Silent mode: auto-selecting first option: ${actualOptions[0]}`)}
    return actualOptions[0]
  }
  
  const result = await vscodeWarningChoice(message, ...actualOptions)
  if (withLog) {log(`User selected: ${result || 'cancelled'}`)}
  return result
}