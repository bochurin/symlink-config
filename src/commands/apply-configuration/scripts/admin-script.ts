import { FILE_NAMES } from '@shared/constants'
import { join } from '@shared/file-ops'
import { writeFile } from '@shared/file-ops'

export async function adminScript(workspaceRoot: string): Promise<void> {
  const adminScript = `@echo off\r\nif "%1"=="" (\r\n  echo Usage: admin.symlink-config.bat [script-name]\r\n  exit /b 1\r\n)\r\npowershell -Command "Start-Process cmd -ArgumentList '/k call \"%1\"' -Verb RunAs"`
  await writeFile(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT, adminScript)
}
