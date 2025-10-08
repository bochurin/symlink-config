import { readFile } from '../../shared/file-ops'

export function read(): string {
  const content = readFile('current.symlink.config.json')
  return content
}
