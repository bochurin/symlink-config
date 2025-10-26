import { FILE_NAMES } from '@shared/constants'
import { basename, join , platform, Platform } from '@shared/file-ops'
import { createTerminal } from '@shared/vscode'

export function runScriptAsAdmin(scriptPath: string, workspaceRoot: string) {
  const currentPlatform = platform()
  const scriptName = basename(scriptPath)
  const needsAdmin = scriptName === FILE_NAMES.APPLY_SYMLINKS_BAT || scriptName === FILE_NAMES.APPLY_SYMLINKS_SH
  
  if (currentPlatform === Platform.Windows) {
    if (needsAdmin) {
      const adminBatPath = join(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT)
      const terminal = createTerminal({
        name: 'Run as Admin',
        cwd: workspaceRoot,
      })
      terminal.sendText(`"${adminBatPath}" "${scriptPath}" && exit`)
      terminal.show()
    } else {
      const terminal = createTerminal({
        name: 'Run Script',
        cwd: workspaceRoot,
      })
      terminal.sendText(`"${scriptPath}" && exit`)
      terminal.show()
    }
  } else {
    const terminal = createTerminal('Run Script')
    terminal.show()
    const sudoPrefix = needsAdmin ? 'sudo ' : ''
    terminal.sendText(
      `cd "${workspaceRoot}" && chmod +x "${scriptName}" && ${sudoPrefix}"./${scriptName}" && exit`,
    )
  }
}
