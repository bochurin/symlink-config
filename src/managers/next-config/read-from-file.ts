import { readFile } from '../../shared/file-ops'

export function readFromFile(): string {
  return readFile('next.symlink.config.json')
}
