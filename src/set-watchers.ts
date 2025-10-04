import * as vscode from 'vscode'
import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import * as workspaceManager from './managers/workspace'
import { useFileWatcher, useConfigWatcher } from './hooks'

export function setWatchers() {
  const watchers: vscode.FileSystemWatcher[] = []
  const config = vscode.workspace.getConfiguration('symlink-config')
  const manageGitignore = config.get<boolean>('manageGitignore', true)
  const hideServiceFiles = config.get<boolean>('hideServiceFiles', false)

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

  if (manageGitignore) {
    watchers.push(
      useFileWatcher({
        pattern: '**/.gitignore',
        ignoreCreateEvents: true,
        onChange: () => gitignoreManager.handleEvent('modified'),
        onDelete: () => gitignoreManager.handleEvent('deleted'),
      })
    )
  }

  if (hideServiceFiles) {
    watchers.push(
      useFileWatcher({
        pattern: '**/.vscode/settings.json',
        ignoreCreateEvents: true,
        onChange: () => workspaceManager.handleEvent('modified'),
        onDelete: () => workspaceManager.handleEvent('deleted'),
      })
    )
  }

  // watchers.push(
  //   useFileWatcher({
  //     pattern: '.git',
  //     ignoreChangeEvents: true,
  //     onCreate: () => gitignoreManager.make(),
  //     onDelete: () => gitignoreManager.make(),
  //   })
  // )

  nextConfigManager.makeFile()
  if (manageGitignore) {
    gitignoreManager.makeFile()
  }
  if (hideServiceFiles) {
    workspaceManager.makeFile()
  }

  // Listen for configuration changes
  const configWatcher = useConfigWatcher({
    section: 'symlink-config',
    handlers: {
      manageGitignore: {
        onEnable: () => gitignoreManager.handleEvent('inited'),
        onDisable: () => gitignoreManager.handleEvent('disabled')
      },
      hideServiceFiles: {
        onEnable: () => workspaceManager.handleEvent('inited'),
        onDisable: () => workspaceManager.handleEvent('disabled')
      }
    }
  })

  return () => {
    watchers.forEach((w) => w.dispose())
    configWatcher.dispose()
  }
}
