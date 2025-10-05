import * as gitignoreManager from './managers/gitignore'
import * as workspaceManager from './managers/workspace'
import { useFileWatcher, useConfigWatcher } from './hooks'
import { readFromConfig } from './shared/config-ops'

export function setWatchers() {
  // const configFileHandlers = [
  //   () => nextConfigManager.makeFile(),
  //   () => nextConfigManager.memo(),
  // ]
  // watchers.push(
  //   useFileWatcher({
  //     pattern: '**/symlink.config.json',
  //     onCreate: [...configFileHandlers],
  //     onChange: [...configFileHandlers],
  //     onDelete: [...configFileHandlers],
  //   })
  // )

  // watchers.push(
  //   useFileWatcher({
  //     pattern: 'next.symlink.config.json',
  //     ignoreCreateEvents: true,
  //     onChange: () => nextConfigManager.handleFileEvent('change'),
  //     onDelete: () => nextConfigManager.handleFileEvent('delete'),
  //   })
  // )

  // watchers.push(
  //   useFileWatcher({
  //     pattern: '.git',
  //     onCreate: () => gitignoreManager.make(),
  //     onDelete: () => gitignoreManager.make(),
  //   })
  // )

  const gitignoreWatcher = useFileWatcher({
    pattern: '**/.gitignore',
    onChange: () => gitignoreManager.handleEvent('modified'),
    onDelete: () => gitignoreManager.handleEvent('deleted')
  })

  const configWatcher = useConfigWatcher({
    sections: [
      {
        section: 'symlink-config',
        parameters: [
          {
            parameter: 'gitignoreServiceFiles',
            onChange: (section, parameter, payload) =>
              workspaceManager.handleConfigChange(section, parameter, payload)
          },
          {
            parameter: 'hideServiceFiles',
            onChange: (section, parameter, payload) =>
              workspaceManager.handleConfigChange(section, parameter, payload)
          },
          {
            parameter: 'hideSymlinkConfigs',
            onChange: (section, parameter, payload) =>
              workspaceManager.handleConfigChange(section, parameter, payload)
          }
        ]
      },
      {
        section: 'files',
        parameters: {
          parameter: 'exclude',
          onChange: (section, parameter, payload) =>
            workspaceManager.handleConfigChange(section, parameter, payload)
        }
      }
    ]
  })

  // set watcher disposals
  return () => {
    gitignoreWatcher.dispose()
    configWatcher.dispose()
  }
}
