import * as vscode from 'vscode'
import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
import { useFileWatcher } from './hooks'

export function setWatchers() {
  const watchers: vscode.FileSystemWatcher[] = []

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

  watchers.push(
    useFileWatcher({
      pattern: '**/.gitignore',
      ignoreCreateEvents: true,
      onChange: () => gitignoreManager.handleEvent('modified'),
      onDelete: () => gitignoreManager.handleEvent('deleted'),
    })
  )

  // watchers.push(
  //   useFileWatcher({
  //     pattern: '.git',
  //     ignoreChangeEvents: true,
  //     onCreate: () => gitignoreManager.make(),
  //     onDelete: () => gitignoreManager.make(),
  //   })
  // )

  nextConfigManager.makeFile()
  gitignoreManager.makeFile()

  return () => watchers.forEach((w) => w.dispose())
}
