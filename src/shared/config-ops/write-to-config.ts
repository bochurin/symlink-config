import * as vscode from 'vscode'

export async function writeToConfig<T>(
  parameter: string,
  value: T
): Promise<void> {
  const config = vscode.workspace.getConfiguration()
  await config.update(parameter, value, vscode.ConfigurationTarget.Workspace)
}
