import { getConfiguration } from '@shared/vscode'

export async function writeSettings<T>(
  parameter: string,
  value: T,
): Promise<void> {
  const config = getConfiguration()
  await config.update(parameter, value, 1) // ConfigurationTarget.Workspace = 1
}
