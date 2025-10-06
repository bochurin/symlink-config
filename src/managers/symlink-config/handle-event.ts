import * as gitignoreManager from '../gitignore'
import * as fileExcludeManager from '../file-exclude'
import { info } from '../../shared/vscode'

export async function handleEvent(
  section: string,
  parameter: string,
  payload: { value: any; old_value: any }
) {
  switch (parameter) {
    case 'gitignoreServiceFiles':
      info(
        `Gitignoring service files ${payload.value ? 'enabled' : 'disabled'}.`
      )
      await gitignoreManager.make()
      break

    case 'hideServiceFiles':
    case 'hideSymlinkConfigs':
      const object =
        parameter === 'hideServiceFiles' ? 'service files' : 'symlink configs'
      const action = payload.value ? 'enabled' : 'disabled'
      const mode =
        parameter === 'hideServiceFiles'
          ? fileExcludeManager.Mode.ServiceFiles
          : fileExcludeManager.Mode.SymlinkConfigs
      info(`Hiding ${object} ${action}.`)
      await fileExcludeManager.make(mode)
      break
  }
}
