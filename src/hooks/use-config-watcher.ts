import * as vscode from 'vscode'

export interface ConfigWatcherConfig {
  section: string
  handlers: Record<string, {
    onChange: (data: { value: any; old_value: any }) => void
  }>
}

export function useConfigWatcher(config: ConfigWatcherConfig): vscode.Disposable {
  const initialConfig = vscode.workspace.getConfiguration(config.section)
  const previousValues: Record<string, any> = {}
  
  // Store initial values
  Object.keys(config.handlers).forEach(key => {
    previousValues[key] = initialConfig.get(key)
  })
  
  return vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration(config.section)) {
      const newConfig = vscode.workspace.getConfiguration(config.section)
      
      Object.keys(config.handlers).forEach(key => {
        const newValue = newConfig.get(key)
        const oldValue = previousValues[key]
        const handler = config.handlers[key]
        
        if (newValue !== oldValue) {
          const data = { value: newValue, old_value: oldValue }
          handler.onChange(data)
          previousValues[key] = newValue
        }
      })
    }
  })
}