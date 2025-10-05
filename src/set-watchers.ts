import { useFileWatcher, useConfigWatcher } from './hooks'
import * as gitignoreManager from './managers/gitignore'
import * as symlinkConfigManager from './managers/symlink-config'
import * as fileExcludeManager from './managers/file-exclude'

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
            onChange: async (section, parameter, payload) =>
              await symlinkConfigManager.handleEvent(
                section,
                parameter,
                payload
              )
          },
          {
            parameter: 'hideServiceFiles',
            onChange: async (section, parameter, payload) =>
              await symlinkConfigManager.handleEvent(
                section,
                parameter,
                payload
              )
          },
          {
            parameter: 'hideSymlinkConfigs',
            onChange: async (section, parameter, payload) =>
              await symlinkConfigManager.handleEvent(
                section,
                parameter,
                payload
              )
          }
        ]
      },
      {
        section: 'files',
        parameters: {
          parameter: 'exclude',
          onChange: (section, parameter, payload) =>
            fileExcludeManager.handleEvent()
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
