export function buildSection(): string {
  try {
    return 'next.symlink.config.json\n'
  } catch {
    return ''
  }
}
