import { readFile, writeFile } from '../../shared/file-ops'
import { sectionStart, sectionEnd } from './constants'
import { build } from './build'

export async function make() {
  const builtSection = build()

  let fileContent = readFile('.gitignore')

  const regex = new RegExp(
    `(${sectionStart}\\n)[\\s\\S]*?(\\n${sectionEnd})`,
    'g'
  )
  const match = regex.exec(fileContent)

  if (match) {
    // Replace existing section
    fileContent = fileContent.replace(regex, `$1${builtSection}$2`)
  } else {
    // Add new section
    const fullSection = `${sectionStart}\n${builtSection}\n${sectionEnd}`
    fileContent = fileContent ? `${fileContent}\n\n${fullSection}` : fullSection
  }

  await writeFile('.gitignore', fileContent)
}
