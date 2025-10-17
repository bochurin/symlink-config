export enum FileEventType {
  Created = 'Created',
  Modified = 'Modified',
  Deleted = 'Deleted',
}

export type FileEvent = { uri: import('vscode').Uri; eventType: FileEventType }

export type Handler = (events: FileEvent[]) => void
export type Filter = (event: FileEvent) => Promise<boolean> | boolean

export interface WatcherConfig {
  pattern: string
  debounce?: number
  filters?: Filter | Filter[]
  events:
    | {
        on: FileEventType | FileEventType[]
        handlers: Handler | Handler[]
      }
    | Array<{
        on: FileEventType | FileEventType[]
        handlers: Handler | Handler[]
      }>
}
