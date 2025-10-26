export function parseGitignore(
  content: string
): Record<string, { spacing: string; active: boolean }> {
  const records: Record<string, { spacing: string; active: boolean }> = {}
  let emptyLineCounter = 0

  content.split('\n').forEach((line) => {
    if (line.trim() === '') {
      records[`__EMPTY_LINE_${emptyLineCounter++}`] = {
        spacing: '',
        active: true
      }
      return
    }

    const match = line.match(/^(\s*)(#?)(\s*)(.*)$/)
    if (!match) {return}

    const [, leadingSpaces, hash, hashSpaces, rest] = match
    const spacing = leadingSpaces + hashSpaces
    const key = rest.trim()

    if (key) {
      records[key] = {
        spacing,
        active: !hash
      }
    }
  })

  return records
}
