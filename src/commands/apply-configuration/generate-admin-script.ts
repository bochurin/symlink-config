import * as vscode from 'vscode'
import * as path from 'path'
import { FILE_NAMES } from '../../shared/constants'

export async function generateAdminScript(workspaceRoot: string): Promise<void> {
  const adminBatPath = path.join(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT)
  const adminScript = `@echo off\r\nif "%1"=="" (\r\n  echo Usage: admin.symlink.config.bat [script-name]\r\n  exit /b 1\r\n)\r\npowershell -Command "Start-Process cmd -ArgumentList '/k call \"%1\"' -Verb RunAs"`
  await vscode.workspace.fs.writeFile(vscode.Uri.file(adminBatPath), Buffer.from(adminScript))
}
