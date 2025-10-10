import { make as makeGitignore } from '../gitignore-file'
import { make as makeExclusion, ExclusionPart } from '../file-exclude-settings'
import { info } from '../../shared/vscode'

export async function handleEvent(
  section: string,
  parameter: string,
  payload: { value: any; old_value: any },
) {
  switch (parameter) {
    case 'gitignoreServiceFiles':
      info(
        `Gitignoring service files ${payload.value ? 'enabled' : 'disabled'}.`,
      )
      await makeGitignore()
      break

    case 'hideServiceFiles':
    case 'hideSymlinkConfigs':
      const object =
        parameter === 'hideServiceFiles' ? 'service files' : 'symlink configs'
      const action = payload.value ? 'enabled' : 'disabled'
      const mode =
        parameter === 'hideServiceFiles'
          ? ExclusionPart.ServiceFiles
          : ExclusionPart.SymlinkConfigs
      info(`Hiding ${object} ${action}.`)
      await makeExclusion(mode)
      break
  }
}
