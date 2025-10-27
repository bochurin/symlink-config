import { platform } from 'os'

export async function platformTestWorkspace(): Promise<string> {
  return platform() === 'win32' ? 'test-ws-win' : 'test-ws-unix'
}