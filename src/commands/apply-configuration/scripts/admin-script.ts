import { FILE_NAMES } from '@shared/constants'
import { join , writeFile , platform, Platform } from '@shared/file-ops'



export async function adminScript(workspaceRoot: string, targetPlatform?: 'windows' | 'unix'): Promise<void> {
  const currentPlatform = platform()
  const generateWindows = !targetPlatform || targetPlatform === 'windows'
  const generateUnix = !targetPlatform || targetPlatform === 'unix'

  if (generateWindows) {
    const windowsScript = `@echo off\r\nif "%1"=="" (\r\n  echo Usage: admin.symlink-config.bat [script-name]\r\n  exit /b 1\r\n)\r\npowershell -Command "Start-Process cmd -ArgumentList '/k call \"%1\"' -Verb RunAs"`
    await writeFile(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT, windowsScript)
  }

  if (generateUnix) {
    const unixScript = `#!/bin/bash\nif [ "$1" = "" ]; then\n  echo "Usage: admin.symlink-config.sh [script-name]"\n  exit 1\nfi\nsudo "$1"`
    await writeFile(workspaceRoot, FILE_NAMES.RUN_ADMIN_SH, unixScript)
  }
}
