export function buildSection(): string {
  try {
    const lines = [
      '# WARNING: This section is auto-generated. Do not modify manually.',
      'next.symlink.config.json'
    ]

    return lines.join('\n')
  } catch {
    return ''
  }
}
