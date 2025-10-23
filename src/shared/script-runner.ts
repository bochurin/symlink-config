import * as vscode from 'vscode'
import * as path from 'path'
import * as os from 'os'
import { FILE_NAMES } from '@shared/constants'

export function runScriptAsAdmin(scriptPath: string, workspaceRoot: string) {
  const isWindows = os.platform() === 'win32'
  const scriptName = path.basename(scriptPath)
  const needsAdmin = scriptName === FILE_NAMES.APPLY_SYMLINKS_BAT || scriptName === FILE_NAMES.APPLY_SYMLINKS_SH
  
  if (isWindows) {
    if (needsAdmin) {
      const adminBatPath = path.join(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT)
      const terminal = vscode.window.createTerminal({
        name: 'Run as Admin',
        cwd: workspaceRoot,
      })
      terminal.sendText(`"${adminBatPath}" "${scriptPath}" && exit`)
      terminal.show()
    } else {
      const terminal = vscode.window.createTerminal({
        name: 'Run Script',
        cwd: workspaceRoot,
      })
      terminal.sendText(`"${scriptPath}" && exit`)
      terminal.show()
    }
  } else {
    const terminal = vscode.window.createTerminal('Run Script')
    terminal.show()
    const sudoPrefix = needsAdmin ? 'sudo ' : ''
    terminal.sendText(
      `cd "${workspaceRoot}" && chmod +x "${scriptName}" && ${sudoPrefix}"./${scriptName}" && exit`,
    )
  }
}