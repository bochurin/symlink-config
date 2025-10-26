import { runScriptAsAdmin } from '@shared/script-runner'
import { dirname } from '@shared/file-ops'

export async function runScript(scriptPath: string) {
  const workspaceRoot = dirname(scriptPath)
  runScriptAsAdmin(scriptPath, workspaceRoot)
}
