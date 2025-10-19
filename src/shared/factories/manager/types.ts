export interface ManagerCallbacks<CT, ET> {
  makeCallback: (params?: { [key: string]: any }) => Promise<CT | undefined>
  needsRegenerateCallback?: (params?: { [key: string]: any }) => boolean
  generateCallback?: (params?: { content?: CT; [key: string]: any }) => CT
  readCallback?: (params?: { [key: string]: any }) => CT
  writeCallback?: (params?: { [key: string]: any }) => Promise<void>
}

export interface Manager<CT, ET> {
  objectName: string
  init: () => Promise<void>
  handleEvent: (params?: { [key: string]: any }) => Promise<void>
  read: (params?: { [key: string]: any }) => CT | undefined
}
