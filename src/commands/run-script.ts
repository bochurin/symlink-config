import { dirname } from '@shared/file-ops'
import { runScriptAsAdmin } from '@shared/script-runner'

export async function runScript(scriptPath: string) {
  const workspaceRoot = dirname(scriptPath)
  runScriptAsAdmin(scriptPath, workspaceRoot)
}
