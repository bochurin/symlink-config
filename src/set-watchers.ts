import * as vscode from 'vscode'
import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as workspaceManager from './managers/workspace'
import { useFileWatcher, useConfigWatcher } from './hooks'

export function setWatchers() {
  const manageGitignore = workspaceManager.readFromConfig(
    'symlink-config.manageGitignore',
    true
  )
  const hideServiceFiles = workspaceManager.readFromConfig(
    'symlink-config.hideServiceFiles',
    false
  )

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

  const gitignoreWatcher = manageGitignore
    ? useFileWatcher({
        pattern: '**/.gitignore',
        onChange: () => gitignoreManager.handleEvent('modified'),
        onDelete: () => gitignoreManager.handleEvent('deleted'),
      })
    : null

  // watchers.push(
  //   useFileWatcher({
  //     pattern: '.git',
  //     onCreate: () => gitignoreManager.make(),
  //     onDelete: () => gitignoreManager.make(),
  //   })
  // )

  // Listen for configuration changes
  const configWatcher = useConfigWatcher({
    sections: [
      {
        section: 'symlink-config',
        parameters: [
          {
            parameter: 'manageGitignore',
            onChange: (section, parameter, payload) =>
              workspaceManager.handleConfigChange(section, parameter, payload),
          },
          {
            parameter: 'hideServiceFiles',
            onChange: (section, parameter, payload) =>
              workspaceManager.handleConfigChange(section, parameter, payload),
          },
        ],
      },
      {
        section: 'files',
        parameters: {
          parameter: 'exclude',
          onChange: (section, parameter, payload) =>
            workspaceManager.handleConfigChange(section, parameter, payload),
        },
      },
    ],
  })

  return () => {
    gitignoreWatcher?.dispose()
    configWatcher.dispose()
  }
}
