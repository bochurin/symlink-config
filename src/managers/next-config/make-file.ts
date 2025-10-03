import * as fs from 'fs'
import * as path from 'path'
import * as state from '../../state'
import { buildNextConfig } from './build-next-config'

export async function makeFile() {
  const content = await buildNextConfig()
  const nextConfigPath = path.join(
    state.getWorkspaceRoot(),
    'next.symlink.config.json'
  )

  fs.writeFileSync(nextConfigPath, content, 'utf8')
}
