import * as symlinkConfigManager from '../symlink-config'

export function generate(): string {
  try {
    const gitignoreServiceFiles = symlinkConfigManager.read(
      'gitignoreServiceFiles'
    )
    const lines = [
      '# WARNING: This section is auto-generated. Do not modify manually.',
      `${gitignoreServiceFiles ? '' : '# '}next.symlink.config.json`
    ]

    return lines.join('\n')
  } catch {
    return ''
  }
}
