import { useFileWatcher, useConfigWatcher } from './hooks'
import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as symlinkConfigManager from './managers/symlink-config'
import * as fileExcludeManager from './managers/file-exclude'

export function setWatchers() {
  let processingQueue = Promise.resolve()

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
  // )
  // watchers.push(
  //   useFileWatcher({
  //     pattern: '.git',
  //     onCreate: () => gitignoreManager.make(),
  //     onDelete: () => gitignoreManager.make(),
  //   })
  // )

  const nextConfigWatcher = useFileWatcher({
    pattern: './next.symlink.config.json',
    onChange: () =>
      (processingQueue = processingQueue.then(() =>
        nextConfigManager.handleEvent('modified')
      )),
    onDelete: () =>
      (processingQueue = processingQueue.then(() =>
        nextConfigManager.handleEvent('deleted')
      ))
  })

  const gitignoreWatcher = useFileWatcher({
    pattern: '**/.gitignore',
    onChange: () =>
      (processingQueue = processingQueue.then(() =>
        gitignoreManager.handleEvent('modified')
      )),
    onDelete: () =>
      (processingQueue = processingQueue.then(() =>
        gitignoreManager.handleEvent('deleted')
      ))
  })

  const configWatcher = useConfigWatcher({
    sections: [
      {
        section: 'symlink-config',
        parameters: [
          {
            parameter: 'gitignoreServiceFiles',
            onChange: (section, parameter, payload) => {
              processingQueue = processingQueue.then(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload)
              )
            }
          },
          {
            parameter: 'hideServiceFiles',
            onChange: (section, parameter, payload) => {
              processingQueue = processingQueue.then(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload)
              )
            }
          },
          {
            parameter: 'hideSymlinkConfigs',
            onChange: (section, parameter, payload) => {
              processingQueue = processingQueue.then(() =>
                symlinkConfigManager.handleEvent(section, parameter, payload)
              )
            }
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
    configWatcher.dispose()
    gitignoreWatcher.dispose()
    nextConfigWatcher.dispose()
  }
}
