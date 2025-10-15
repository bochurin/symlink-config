import { writeFile } from '../../shared/file-ops'
import { FILE_NAMES } from '../../shared/constants'

export async function write(content: string) {
  await writeFile(FILE_NAMES.GITIGNORE, content)
}
