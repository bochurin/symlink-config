import * as fs from 'fs'
import * as path from 'path'

import * as state from '../../state'

export function memo() {
  const nextConfigPath = path.join(
    state.getWorkspaceRoot(),
    'next.symlink.config.json'
  )
  try {
    if (fs.existsSync(nextConfigPath)) {
      const config = fs.readFileSync(nextConfigPath, 'utf8')
      state.setNextConfig(config)
      console.log('Memoized next config with existing file content')
    }
  } catch (error) {
    console.error('Failed to memo next config:', error)
  }
}
