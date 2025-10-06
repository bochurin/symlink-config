export function parseGitignore(content: string): Record<string, { spacing: string; active: boolean }> {
  const records: Record<string, { spacing: string; active: boolean }> = {}
  
  content.split('\n').forEach(line => {
    const match = line.match(/^(\s*)(#?)(\s*)(.*)$/)
    if (!match) return
    
    const [, leadingSpaces, hash, hashSpaces, rest] = match
    const spacing = leadingSpaces + (hash ? hash + hashSpaces : '')
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