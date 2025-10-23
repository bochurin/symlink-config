import { runScriptAsAdmin } from '@shared/script-runner'
import * as path from 'path'

export async function runScript(scriptPath: string) {
  const workspaceRoot = path.dirname(scriptPath)
  runScriptAsAdmin(scriptPath, workspaceRoot)
}