export function assembleGitignore(
  records: Record<string, { spacing: string; active: boolean }>
): string {
  return Object.entries(records)
    .map(([key, { spacing, active }]) => {
      if (active) {
        return spacing + key
      } else {
        const hasHash = spacing.includes('#')
        return hasHash ? spacing + key : spacing + '# ' + key
      }
    })
    .join('\n')
}
