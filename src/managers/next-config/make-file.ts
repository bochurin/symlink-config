import * as fs from 'fs'
import * as path from 'path'
import * as state from '../../shared/state'
import { buildNextConfig } from './build-next-config'

export function makeFile() {
  const content = buildNextConfig()
  const nextConfigPath = path.join(
    state.getWorkspaceRoot(),
    'next.symlink.config.json'
  )

  fs.writeFileSync(nextConfigPath, content, 'utf8')
}
