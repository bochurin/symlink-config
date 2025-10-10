import { readFile } from '../../shared/file-ops'

export function read(): string {
  const content = readFile('next.symlink.config.json')
  return content
}
