import * as path from 'path'

import { FILE_NAMES } from '@shared/constants'
import * as vscode from 'vscode'

export class ScriptCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const fileName = path.basename(document.fileName)
    const codeLenses: vscode.CodeLens[] = []

    if (
      fileName === FILE_NAMES.APPLY_SYMLINKS_BAT ||
      fileName === FILE_NAMES.APPLY_SYMLINKS_SH
    ) {
      const title = '$(play) RUN AS ADMIN'
      const command = {
        title,
        command: 'symlink-config.runScript',
        arguments: [document.fileName],
      }

      // Add buttons at beginning and end
      codeLenses.push(
        new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), command),
      )
      const lineCount = document.lineCount
      if (lineCount > 1) {
        codeLenses.push(
          new vscode.CodeLens(
            new vscode.Range(lineCount - 1, 15, lineCount - 1, 0),
            command,
          ),
        )
      }
    }

    if (
      fileName === FILE_NAMES.CLEAN_SYMLINKS_BAT ||
      fileName === FILE_NAMES.CLEAN_SYMLINKS_SH
    ) {
      const title = '$(trash) RUN'
      const command = {
        title,
        command: 'symlink-config.runScript',
        arguments: [document.fileName],
      }

      // Add buttons at beginning and end
      codeLenses.push(
        new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), command),
      )
      const lineCount = document.lineCount
      if (lineCount > 1) {
        codeLenses.push(
          new vscode.CodeLens(
            new vscode.Range(lineCount - 1, 15, lineCount - 1, 0),
            command,
          ),
        )
      }
    }

    return codeLenses
  }
}
