import { log } from '@log'
import { useSymlinkConfigManager } from '@managers'
import { SETTINGS } from '@shared/constants'
import { choice as vscodeChoice } from '@shared/vscode'

export async function choice(message: string, ...options: string[]): Promise<string | undefined>
export async function choice(message: string, withLog: boolean, ...options: string[]): Promise<string | undefined>
export async function choice(message: string, withLogOrFirstOption: boolean | string, ...options: string[]): Promise<string | undefined> {
  let withLog = true
  let actualOptions: string[]
  
  if (typeof withLogOrFirstOption === 'boolean') {
    withLog = withLogOrFirstOption
    actualOptions = options
  } else {
    actualOptions = [withLogOrFirstOption, ...options]
  }
  
  if (withLog) {log(`CHOICE: ${message} [${actualOptions.join(', ')}]`)}
  
  const settingsManager = useSymlinkConfigManager()
  const silent = settingsManager.read(SETTINGS.SYMLINK_CONFIG.SILENT)
  
  if (silent) {
    if (withLog) {log(`Silent mode: auto-selecting first option: ${actualOptions[0]}`)}
    return actualOptions[0]
  }
  
  const result = await vscodeChoice(message, ...actualOptions)
  if (withLog) {log(`User selected: ${result || 'cancelled'}`)}
  return result
}